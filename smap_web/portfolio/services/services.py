#service layer to do all the filter and calculations
from portfolio.repositories.repositories import PortfolioRepository
from stocks.models import Stock

class PortfolioService:
    @staticmethod
    def get_watchlist(user):
        watchlist_items = PortfolioRepository.get_watchlist_by_user(user=user)
        return [{
            'id':item.id,
            'stock_id':item.stock.id,
            'symbol':item.stock.symbol,
            'company_name':item.stock.company_name,
            'added_at':item.added_at
            
        } for item in watchlist_items
                ]
        
    @staticmethod
    def add_to_watchlist(user, stock_id):
        try:
            stock = Stock.objects.get(id = stock_id)
        except Stock.DoesNotExist:
            return None, 'stock not found!'
        
        if PortfolioRepository.get_watchlist_by_user(user=user).filter(stock=stock).exists():
            return None, 'Stock already exists in your watchlist!'
        
        entry = PortfolioRepository.create_watchlist_entry(user,stock)
        return {
            'id': entry.id,
            'symbol': stock.symbol,
            'company_name':stock.company_name
        }
        
    @staticmethod
    def execute_trade(user, stock_id, transaction_type, quantity):
        try:
            stock = Stock.objects.get(id=stock_id)
        except Stock.DoesNotExist:
            return None, "Stock not found"

        latest_price = PortfolioRepository.get_latest_stock_price(stock)
        if latest_price is None:
            return None, "Price data unavailable for this stock"

        transaction = PortfolioRepository.create_transaction(
            user=user,
            stock=stock,
            transaction_type=transaction_type,
            quantity=quantity,
            execution_price=latest_price
        )

        return {
            "transaction_id": transaction.id,
            "symbol": stock.symbol,
            "transaction_type": transaction.transaction_type,
            "quantity": transaction.quantity,
            "execution_price": float(transaction.execution_price),
            "timestamp": transaction.timestamp
        }, None

    @staticmethod
    def get_portfolio_summary(user):
        transactions = PortfolioRepository.get_transactions_by_user(user)
        
        # Aggregate logic isolated out of the view layer
        portfolio = {}
        for t in transactions:
            symbol = t.stock.symbol
            if symbol not in portfolio:
                portfolio[symbol] = {
                    'stock_obj': t.stock,
                    'stock_id': t.stock.id,
                    'symbol': symbol,
                    'company_name': t.stock.company_name,
                    'net_shares': 0,
                    'total_invested': 0.0
                }
            
            if t.transaction_type == 'BUY':
                portfolio[symbol]['net_shares'] += t.quantity
                portfolio[symbol]['total_invested'] += float(t.quantity * t.execution_price)
            elif t.transaction_type == 'SELL':
                portfolio[symbol]['net_shares'] -= t.quantity

        active_holdings = []
        for symbol, data in portfolio.items():
            if data['net_shares'] > 0:
                latest_price = PortfolioRepository.get_latest_stock_price(data['stock_obj'])
                current_price = float(latest_price) if latest_price else 0.0
                
                active_holdings.append({
                    "stock_id": data['stock_id'],
                    "symbol": data['symbol'],
                    "company_name": data['company_name'],
                    "net_shares": data['net_shares'],
                    "total_invested": round(data['total_invested'], 2),
                    "current_price": current_price,
                    "current_value": round(data['net_shares'] * current_price, 2)
                })

        return active_holdings    