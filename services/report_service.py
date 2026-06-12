from services.analytic_services import AnalyticalService
from services.ranking_services import RankStocks
from services.stock_services import StockServices
import os

class ReportService:
    def __init__(self):
        self.analytics = AnalyticalService()
        self.ranking = RankStocks()
        self.stockservices = StockServices()
        
        os.makedirs('report', exist_ok=True)
        
    def generate_report(self):
        filepath= os.path.join('report', 'market_report.txt')
        allstocks = self.stockservices.show_all_stocks()
        priceleaderboard = self.ranking.rankbyprice(limit=10)
        
        with open(filepath,'w', encoding='utf-8') as file:
            file.write('_______SAMP DAILY REPORT (LIVE)______\n')
            file.write('All Available Stocks: \n')
            for s in allstocks:
                file.write(f'Symbol: {s.symbol}| Name: {s.company_name}| Sector: {s.sector}| Market Cap: {s.market_cap}\n')
            file.write('\n')
            file.write('--------------------------------------------------\n')
            file.write("Rankings (Closing Price): \n")
            for rank in priceleaderboard:
                file.write(f'Rank: {rank['market_rank']}| Symbol: {rank['symbol']}| Price: INR{rank['close_price']}| Date: {rank['trade_date']}\n')    
        print(f'{filepath} generated successfully!!\n')
            
            
    def generate_summary(self):
        filepath = os.path.join('report', 'summary.txt')
        market_summary = self.analytics.show_market_summry()
        growthrank = self.ranking.rankbygrowth()
        volumerank = self.ranking.rankbyvolume()
        
        with open(filepath, 'w', encoding='utf-8') as file:
            file.write('_________SAMP MARKET SUMMARY________\n')
            
            hcp = market_summary['Highest Closing Price']
            lcp = market_summary['Lowest Closing Price']
            avg = market_summary['Average Closing Price']
            mas = market_summary['Most Active Stock']
            las = market_summary['Least Active Stock']
            
            file.write(f'Highest Market Close: {hcp.get('symbol')}| INR {hcp.get('close_price')}| {hcp.get('trade_date')}\n')
            file.write(f'Lowest Market Close: {lcp.get('symbol')}| INR {lcp.get('close_price')}| {lcp.get('trade_date')}\n')
            file.write(f'Average Market Close: {avg.get('symbol')}| INR {avg.get('close_price')}| {avg.get('trade_date')}\n')
            file.write(f'Most Active Stock: {mas.get('symbol')}| INR {mas.get('volume')}| {mas.get('trade_date')}\n')
            file.write(f'Least Active Stock: {las.get('symbol')}| INR {las.get('volume')}| {las.get('trade_date')}\n')
            file.write('--------------------------------------------------\n')
            file.write("Rankings (Growth): \n")
            for rank in growthrank:
                file.write(f'Rank: {rank['market_rank']}| Symbol: {rank['symbol']}| Growth: {rank['growth_percent']}%\n')
            file.write('--------------------------------------------------\n')
            file.write('Rankings (Most Active): \n')
            for rank in volumerank:
                file.write(f'Rank: {rank['market_rank']}| Symbol: {rank['symbol']}| Volume: {rank['volume']}\n')
                
        print(f'{filepath} generated successfully!!')
            