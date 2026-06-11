from repositories.stock_price_repository import StockPriceRepository

class AnalyticalService:
    def __init__(self):
        self.price_repo = StockPriceRepository()
        
    def show_market_summry(self)->dict:
        
        highestclosingprice = self.price_repo.highest_closing_price()
        lowestclosingprice = self.price_repo.lowest_closing_price()
        avg_closing = self.price_repo.average_closing_price()
        mostactive = self.price_repo.maximum_trading_volume()
        leastactive = self.price_repo.minimum_trading_volume()
        
        return {
            'Highest Closing Price':highestclosingprice,
            'Lowest Closing Price': lowestclosingprice,
            'Average Closing Price': avg_closing,
            'Most Active Stock': mostactive,
            'Least Active Stock': leastactive
        }