from sql.database import DatabaseConnector
from typing import List
from models.stock import Stock

class StockRepository:
    def __init__(self):
        self.connect = DatabaseConnector()
        
    def get_stock(self)->List[Stock]:
        query = '''SELECT * FROM stocks
        ORDER BY id;'''
        rows = self.connect.execute_read_query(query)
        #this function helps in unpacking dictioaries directly into dataclass
        return [Stock(**row) for row in rows]
    
    def search_stock(self, keyword:str)->dict:
        query = '''SELECT * FROM stocks 
        WHERE symbol ILIKE %s OR company_name ILIKE %s;'''
        searchterm = f'%{keyword}%' # keyword can be company id or company symbol
        #we didnt used f string so that no one can use malicious queries 
        rows = self.connect.execute_read_query(query, (searchterm,searchterm))
        #because we have 2 search terms
        
        return [Stock(**row) for row in rows] #for unpacting dict into dataclass
        
        