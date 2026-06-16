from sql.database import DatabaseConnector
from typing import List
from models.stock import Stock

class StockRepository:
    def __init__(self):
        # Kept consistent with your StockPriceRepository
        self.db = DatabaseConnector()
        
    def get_all_stocks(self) -> List[Stock]:
        query = '''SELECT * FROM stocks
        ORDER BY id;'''
        
        rows = self.db.execute_read_query(query)
        # Unpacks dictionaries directly into dataclass
        return [Stock(**row) for row in rows]
    
    def search_stock(self, keyword: str) -> List[Stock]: # Fixed the return type hint!
        query = '''SELECT * FROM stocks 
        WHERE symbol ILIKE %s OR company_name ILIKE %s;'''
        
        searchterm = f'%{keyword}%' 
        
        # Parameterized query prevents SQL injection attacks
        rows = self.db.execute_read_query(query, (searchterm, searchterm))
        
        # Unpacks dictionaries directly into dataclass
        return [Stock(**row) for row in rows]