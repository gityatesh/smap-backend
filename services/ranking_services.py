from repositories.stock_price_repository import StockPriceRepository

class RankStocks:
    def __init__(self):
        self.stock_price = StockPriceRepository()
       
    def rankbyvolume(self)->list:
        return self.stock_price.rank_by_volume()
    
    def rankbyprice(self, limit:int = 5)->list:
        rank= self.stock_price.rank_by_price()
        return rank[:limit]
            
    #growth = closing-opening)/opening * 100: we'll rank based on this criteria
    def rankbygrowth(self):
        return self.stock_price.rank_by_growth()