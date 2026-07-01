from stocks.models import Stock,StockPrice
from django.db.models import Min,Max

class StockRepository:
    
    #to return stocks on based of search quesry or to return all stocks
    @staticmethod
    def get_all_stocks(search_query = None):
        '''fetches the search result and return in JSON format'''
        stocks = Stock.objects.all()
        if search_query:
            stocks = stocks.filter(symbol__icontains = search_query)
        return stocks
    
    #to return stocks on basis of search (symbol)
    @staticmethod
    def get_stock_by_symbol(symbol):
        try:
            return Stock.objects.get(symbol = symbol.upper())
        except Stock.DoesNotExist:
            return None    
        
    # Returns the raw QuerySet of prices, ordered by date
    @staticmethod
    def get_stock_prices(stock_instance):
        return StockPrice.objects.filter(stock = stock_instance).order_by('-trade_date')
    
    #returns the market summary
    @staticmethod
    def get_market_summary():
        # Executes the aggregations natively in PostgreSQL for maximum speed
        stats = StockPrice.objects.aggregate(
            latest_date = Max('trade_date'),
            highest_close_price = Max('close_price'),
            lowest_close_price = Min('close_price')
        )
        
        return {
            'total_stocks':Stock.objects.count(),
            'total_price_records':StockPrice.objects.count(),
            'latest_trading_date':stats['latest_date'],
            'highest_closing_price':stats['highest_close_price'],
            'lowest_closing_price':stats['lowest_close_price']
        }
        
    #get top 5 stocks(on basis of close price(latest date))
    @staticmethod
    def get_top_stocks(limit=5):
        max_date = StockPrice.objects.aggregate(Max('trade_date'))
        absolute_latest_date = max_date['trade_date__max']
        
        if not absolute_latest_date:
            return None
        
        return StockPrice.objects.filter(trade_date = absolute_latest_date).order_by('-close_price')[:limit]
    