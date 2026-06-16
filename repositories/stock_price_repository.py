from sql.database import DatabaseConnector
from typing import List, Dict, Any
from models.stock_price import StockPrice

class StockPriceRepository:
    def __init__(self):
        self.db = DatabaseConnector()
        
    def get_prices_by_stock_id(self, stock_id: int) -> List[StockPrice]:
        query = '''SELECT * FROM stock_prices
        WHERE stock_id = %s 
        ORDER BY trade_date DESC;'''
        
        rows = self.db.execute_read_query(query, (stock_id,))
        return [StockPrice(**row) for row in rows]
    
    def highest_closing_price(self) -> Dict[str, Any]:
        query = '''SELECT s.symbol, s.company_name, sp.close_price, sp.trade_date
        FROM stocks s
        JOIN stock_prices sp ON s.id = sp.stock_id
        ORDER BY sp.close_price DESC
        LIMIT 1;'''
        
        rows = self.db.execute_read_query(query)
        return rows[0] if rows else {'error': 'query execution failed'}
        
    def lowest_closing_price(self) -> Dict[str, Any]:
        query = '''SELECT s.symbol, s.company_name, sp.close_price, sp.trade_date
        FROM stocks s
        JOIN stock_prices sp ON s.id = sp.stock_id
        ORDER BY sp.close_price ASC
        LIMIT 1;'''
        
        rows = self.db.execute_read_query(query)
        return rows[0] if rows else {'error': 'query execution failed'}
        
    def average_closing_price(self) -> Dict[str, Any]:
        # Added ROUND() so Python doesn't get a crazy 15-decimal number from Postgres
        query = '''SELECT ROUND(AVG(close_price), 2) AS average_closing_price
        FROM stock_prices;'''
        
        rows = self.db.execute_read_query(query)
        return rows[0] if rows else {'error': 'query execution failed'}
    
    def maximum_trading_volume(self) -> Dict[str, Any]:
        query = '''SELECT s.symbol, s.company_name, sp.volume, sp.trade_date
        FROM stocks s
        JOIN stock_prices sp ON s.id = sp.stock_id
        ORDER BY sp.volume DESC
        LIMIT 1;'''
        
        rows = self.db.execute_read_query(query)
        return rows[0] if rows else {'error': 'query execution failed'}
    
    def minimum_trading_volume(self) -> Dict[str, Any]:
        query = '''SELECT s.symbol, s.company_name, sp.volume, sp.trade_date
        FROM stocks s
        JOIN stock_prices sp ON s.id = sp.stock_id
        ORDER BY sp.volume ASC
        LIMIT 1;'''
        
        rows = self.db.execute_read_query(query)
        return rows[0] if rows else {'error': 'query execution failed'}
    
    def rank_by_price(self) -> List[dict]:
        # Filter removed: Assumes the database only holds the current day's snapshot
        query = '''
        SELECT s.symbol, s.company_name, sp.close_price, sp.trade_date, 
        RANK() OVER (ORDER BY sp.close_price DESC) AS market_rank
        FROM stocks s
        JOIN stock_prices sp ON s.id = sp.stock_id LIMIT 10;
        '''
        return self.db.execute_read_query(query)
    
    def rank_by_volume(self) -> List[dict]:
        # Filter removed: Assumes the database only holds the current day's snapshot
        query = '''
        SELECT s.symbol, s.company_name, sp.volume, sp.trade_date, 
        RANK() OVER (ORDER BY sp.volume DESC) AS market_rank
        FROM stocks s
        JOIN stock_prices sp ON s.id = sp.stock_id LIMIT 10;
        '''
        return self.db.execute_read_query(query)
    
    def rank_by_growth(self) -> List[dict]:
        # Filter removed: Assumes the database only holds the current day's snapshot
        query = '''
        SELECT s.symbol, s.company_name, 
        ROUND(((sp.close_price - sp.open_price) / sp.open_price) * 100, 2) AS growth_percent, 
        sp.trade_date, 
        RANK() OVER (ORDER BY ((sp.close_price - sp.open_price) / sp.open_price) DESC) AS market_rank
        FROM stocks s
        JOIN stock_prices sp ON s.id = sp.stock_id LIMIT 10;
        '''
        return self.db.execute_read_query(query)