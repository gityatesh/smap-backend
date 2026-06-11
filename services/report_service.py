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
        ospath= os.path.join('report', 'report.txt')
        priceleaderboard = self.ranking.rankbyprice(limit=10)
        