#service layer to do all the filter and calculations
from portfolio.repositories.repositories import PortfolioRepository
from portfolio.models import WatchlistItem, WatchlistGroup
from stocks.models import Stock
from decimal import Decimal

class PortfolioService:
    @staticmethod
    def get_user_watchlists(user):
        """Fetches all watchlists for a user and injects LIVE market data (Flaw 3 Fix)"""
        # Grab all the user's custom folders
        groups = WatchlistGroup.objects.filter(user=user).prefetch_related('items__stock')
        
        watchlist_data = []
        for group in groups:
            group_data = {
                "id": group.id,
                "name": group.name,
                "items": []
            }
            
            # Loop through the stocks inside this specific folder
            for item in group.items.all():
                stock = item.stock
                
                # 🚨 FLAW 3 FIX: Ping your price fetcher to get the live data!
                latest_price = PortfolioRepository.get_latest_stock_price(stock)
                current_price = float(latest_price) if latest_price else 0.0
                
                group_data["items"].append({
                    "item_id": item.id,
                    "symbol": stock.symbol,
                    "company_name": stock.company_name,
                    "current_price": round(current_price, 2)
                })
            
            watchlist_data.append(group_data)
            
        return watchlist_data

    @staticmethod
    def create_watchlist_group(user, name):
        """Creates a brand new custom-named folder"""
        group, created = WatchlistGroup.objects.get_or_create(user=user, name=name)
        if not created:
            return None, "A watchlist with this name already exists."
        return group, None

    @staticmethod
    def add_to_watchlist(user, group_id, symbol):
        """Adds a stock to a specific custom folder"""
        try:
            group = WatchlistGroup.objects.get(id=group_id, user=user)
        except WatchlistGroup.DoesNotExist:
            return None, "Watchlist folder not found."
            
        try:
            stock = Stock.objects.get(symbol=symbol)
        except Stock.DoesNotExist:
            return None, "Stock not found in our database."
            
        item, created = WatchlistItem.objects.get_or_create(group=group, stock=stock)
        if not created:
            return None, f"{symbol} is already in {group.name}!"
            
        return item, None
    
    @staticmethod
    def delete_watchlist_group(user, group_id):
        try:
            group = WatchlistGroup.objects.get(id=group_id, user=user)
            group.delete()
            return "Watchlist deleted successfully.", None
        except WatchlistGroup.DoesNotExist:
            return None, "Watchlist not found."

    @staticmethod
    def remove_from_watchlist(user, item_id):
        try:
            # We check group__user=user so people can't delete other users' stocks
            item = WatchlistItem.objects.get(id=item_id, group__user=user)
            item.delete()
            return "Stock removed from watchlist.", None
        except WatchlistItem.DoesNotExist:
            return None, "Item not found."
        
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
                    'average_buy_price': 0.0  # We track the exact average price paid per share
                }
            
            if t.transaction_type == 'BUY':
                current_shares = portfolio[symbol]['net_shares']
                current_avg_price = portfolio[symbol]['average_buy_price']
                
                # Calculate the math for the new average buy price
                total_cost_before = current_shares * current_avg_price
                cost_of_new_shares = t.quantity * float(t.execution_price)
                
                portfolio[symbol]['net_shares'] += t.quantity
                
                # Prevent division by zero, then calculate new average
                if portfolio[symbol]['net_shares'] > 0:
                    portfolio[symbol]['average_buy_price'] = (total_cost_before + cost_of_new_shares) / portfolio[symbol]['net_shares']
                    
            elif t.transaction_type == 'SELL':
                portfolio[symbol]['net_shares'] -= t.quantity
                
                # If they sold all their shares, reset their math to zero
                if portfolio[symbol]['net_shares'] <= 0:
                    portfolio[symbol]['average_buy_price'] = 0.0
                    portfolio[symbol]['net_shares'] = 0

        active_holdings = []
        for symbol, data in portfolio.items():
            if data['net_shares'] > 0:
                latest_price = PortfolioRepository.get_latest_stock_price(data['stock_obj'])
                current_price = float(latest_price) if latest_price else 0.0
                
                # Grab our variables to make the profit math clean
                net_shares = data['net_shares']
                avg_buy_price = data['average_buy_price']
                
                # The Final Financial Math
                total_cost = net_shares * avg_buy_price
                current_value = net_shares * current_price
                net_profit = current_value - total_cost
                
                active_holdings.append({
                    "symbol": data['symbol'],
                    "company_name": data['company_name'],
                    "net_shares": net_shares,
                    "avg_buy_price": round(avg_buy_price, 2),        # NEW: The execution price
                    "total_cost": round(total_cost, 2),              # NEW: Replaced total_invested
                    "current_price": round(current_price, 2),
                    "current_value": round(current_value, 2),
                    "net_profit": round(net_profit, 2)               # NEW: The profit!
                })

        return active_holdings  