from datetime import date
from typing import List
from models.stock import Stock
from models.stock_price import StockPrice
from repositories.stock_repository import StockRepository
from repositories.stock_price_repository import StockPriceRepository

class StockServices:
    def __init__(self):
        self.stocks = StockRepository()
        self.stockprice = StockPriceRepository()
        
    def show_all_stocks(self)->List[Stock]:
        return self.stocks.get_stock()
    
    def search_stocks(self, keyword:str)->List[Stock]:
        if not keyword or keyword.isspace():
            return ['please enter keyword']
        return self.stocks.search_stock(keyword)
    
    def get_stock_history(self, stock_id:int)->List[StockPrice]:
        if not stock_id:
            return ['please enter stock_id to search']
        return self.stockprice.get_prices_by_stock_id(stock_id)
        
        