# this repo layer is only used to fetch data from the database
from portfolio.models import Transaction
from stocks.models import StockPrice

class PortfolioRepository:
    # @staticmethod
    # def get_watchlist_by_user(user):
    #     return WatchlistGroup.objects.filter(user=user)
    
    # @staticmethod
    # def create_watchlist_entry(user, stock):
    #     return WatchlistGroup.objects.create(user = user, stock = stock)
    
    @staticmethod
    def get_transactions_by_user(user):
        return Transaction.objects.filter(user = user)
    
    @staticmethod
    def create_transaction(user, stock, transaction_type, quantity, execution_price):
        return Transaction.objects.create(
            user = user,
            stock=stock,
            transaction_type = transaction_type,
            quantity = quantity,
            execution_price = execution_price
        )
        
    @staticmethod
    def get_latest_stock_price(stock):
        try:
            return StockPrice.objects.filter(stock = stock).latest('trade_date').close_price
        except StockPrice.DoesNotExist:
            return None