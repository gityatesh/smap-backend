#service layer to do all the filter and calculations
from portfolio.repositories.repositories import PortfolioRepository
from portfolio.models import Watchlist
from stocks.models import Stock
from decimal import Decimal

class PortfolioService:
    @staticmethod
    def get_watchlist(user):
        watchlist_items = PortfolioRepository.get_watchlist_by_user(user=user)
        return [{
            'symbol':item.stock.id,
            'symbol':item.stock.symbol,
            'company_name':item.stock.company_name,
            'added_at':item.added_at
            
        } for item in watchlist_items
                ]
        
    @staticmethod
    def add_to_watchlist(user, symbol):
        try:
            # 🛡️ THE FIX: Query the database using symbol=symbol, NOT id=symbol
            stock = Stock.objects.get(symbol=symbol)
        except Stock.DoesNotExist:
            return None, "Stock not found"

        # Now that you have the actual Stock object, you can safely add it 
        # (Assuming your model is named Watchlist or WatchlistItem)
        watchlist_item, created = Watchlist.objects.get_or_create(user=user, stock=stock)

        if not created:
            return None, f"{symbol} is already in your watchlist!"
            
        return f"{symbol} added to watchlist!", None
        
    @staticmethod
    def execute_trade(user, symbol, transaction_type, quantity):
        try:
            stock = Stock.objects.get(symbol=symbol)
        except Stock.DoesNotExist:
            return None, "Stock not found"

        latest_price = PortfolioRepository.get_latest_stock_price(stock)
        if latest_price is None:
            return None, "Price data unavailable for this stock"

        # 1. Calculate the math safely
        quantity = int(quantity)
        trade_value = Decimal(str(latest_price)) * quantity

        # 2. Grab the user's wallet
        try:
            profile = user.investor_profile
        except AttributeError:
            return None, "User wallet not found"

        # 3. Handle BUY logic (Check balance & Deduct)
        if transaction_type == 'BUY':
            if profile.available_cash < trade_value:
                return None, f"Insufficient funds. Cost: ${trade_value:.2f}, Balance: ${profile.available_cash:.2f}"
            
            profile.available_cash -= trade_value

        # 4. Handle SELL logic (Check owned shares & Add cash)
        elif transaction_type == 'SELL':
            # Calculate how many shares they actually own right now
            transactions = PortfolioRepository.get_transactions_by_user(user).filter(stock=stock)
            net_shares = sum(t.quantity if t.transaction_type == 'BUY' else -t.quantity for t in transactions)
            
            if net_shares < quantity:
                return None, f"Insufficient shares. You only own {net_shares} shares of {symbol}."
                
            profile.available_cash += trade_value

        else:
            return None, "Invalid transaction type"

        # 5. Save the updated wallet balance to the database
        profile.save()

        # 6. Record the transaction receipt
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
            "timestamp": transaction.timestamp,
            "new_balance": float(profile.available_cash) # 👈 ADD THIS LINE
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
                    "symbol": data['symbol'],
                    "company_name": data['company_name'],
                    "net_shares": data['net_shares'],
                    "total_invested": round(data['total_invested'], 2),
                    "current_price": current_price,
                    "current_value": round(data['net_shares'] * current_price, 2)
                })

        return active_holdings    