from dataclasses import dataclass

@dataclass
class Stock:
    id:int
    symbol:str
    company_name:str
    sector:str
    market_cap:str