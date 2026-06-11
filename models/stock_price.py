from dataclasses import dataclass
from datetime import date

@dataclass
class StockPrice:
    id:int
    stock_id:int 
    trade_date:date
    open_price:float
    high_price:float
    low_price:float
    close_price:float
    volume:int
    