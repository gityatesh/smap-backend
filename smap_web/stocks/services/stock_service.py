from stocks.repositories.stock_repository import StockRepository
from django.core.paginator import Paginator

class StockService:
    """
    This layer handles all Business Logic. 
    It formats data, handles pagination, and enforces rules.
    It returns a tuple: (data, error_message) so the View knows what to do.
    Basically the chief of our restorent
    """
    
    
    @staticmethod
    def get_all_stocks(search_query = None):
        stocks = StockRepository.get_all_stocks(search_query=search_query)
        data = [
            {
                'Symbol':stock.symbol,
                'Company_name':stock.company_name
            } for stock in stocks
        ]
        return data,None
    
    @staticmethod
    def get_stock_profile(symbol):
        stock = StockRepository.get_stock_by_symbol(symbol = symbol)
        if not stock:
            return None, f'Stock with symbol {symbol.upper()} not found'
        
        data = {
            'Symbol':stock.symbol,
            "Company_name": stock.company_name,
            'sector':stock.sector,
            'market cap': stock.market_cap,
            'source': stock.source.name if stock.source else '-'
        }
        return data,None
    
    @staticmethod
    def get_stock_prices(symbol, page_number):
        stock = StockRepository.get_stock_by_symbol(symbol=symbol)
        if not stock:
            return None, f'Stock with symbol {symbol} not found!'
        
        stockprices = StockRepository.get_stock_prices(stock)
        paginator = Paginator(stockprices, 20)#a page can hold 20 stock prices
        page_obj = paginator.get_page(page_number)
        
        data=[]
        for price in page_obj:
            data.append({
                'Date':price.trade_date,
                "open_price": price.open_price,
                "high_price": price.high_price,
                "low_price": price.low_price,
                "close_price": price.close_price,
                "volume": price.volume
            })
        response_payload = {
            'metadata':{
                'total_records':paginator.count,
                'total_pages':paginator.num_pages,
                'current_page':page_obj.number,
                'has_next_page':page_obj.has_next(),
                'has_previous_page':page_obj.has_previous(),
            },
            'data':data
        }
        return response_payload,None
    
    @staticmethod
    def get_market_summary():
        data = StockRepository.get_market_summary()
        return data,None
    
    @staticmethod
    def get_top_stocks(limit=5):
        top_stocks = StockRepository.get_top_stocks(limit=limit)
        data=[]
        for s in top_stocks:
            data.append({
                'id': s.stock.id,
                'Symbol': s.stock.symbol,
                'Comapany Name': s.stock.company_name,
                'Close Price': s.close_price,
                'Date': s.trade_date
            })
        return data,None