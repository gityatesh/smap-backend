import sys
from pathlib import Path
from django.core.management.base import BaseCommand

#this connects with our etl folder inside the root directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.append(str(BASE_DIR))

from etl.etl_pipeline import ETLPipeline

class Command(BaseCommand):
    help = 'Runs the In-Memory ETL pipeline to fetch and load stock data into PostgreSQL'
    
    def handle(self, *args, **kwargs):
        
        self.stdout.write(self.style.SUCCESS('Starting Django........\nStarting ETL pipeline..........'))
        symbols_to_track = [
    'SBIN.NS',

    # US Technology
    'MSFT',
    'GOOGL',
    'AMZN',
    'META',
    'NVDA',
    'AMD',
    'NFLX',
    'INTC',
    'ORCL',
    'CRM',
    'ADBE',
    'CSCO',
    'QCOM',

    # US Financials
    'JPM',
    'BAC',
    'WFC',
    'GS',
    'MS',
    'C',
    'AXP',
    'BLK',
    'SCHW',
    'USB',

    # US Healthcare
    'JNJ',
    'PFE',
    'MRK',
    'ABBV',
    'LLY',
    'UNH',
    'TMO',
    'ABT',
    'BMY',
    'DHR',

    # US Consumer
    'KO',
    'PEP',
    'MCD',
    'SBUX',
    'NKE',
    'DIS',
    'COST',

    # Additional US
    'AAPL',
    'TSLA',

    # Indian Stocks
    'RELIANCE.NS',
    'TCS.NS',
    'INFY.NS',
    'HDFCBANK.NS',
    'ICICIBANK.NS',
    'ITC.NS',
    'BHARTIARTL.NS',
    'LT.NS',
    'HINDUNILVR.NS'
]
        
        try:
            pipeline = ETLPipeline(symbols=symbols_to_track, days=30)
            success=pipeline.run_pipeline()
            if success:
                self.stdout.write(self.style.SUCCESS('ELT Pipeline executed and loaded successfully!'))
            else:
                self.stdout.write(self.style.ERROR('ETL Pipeline execution failed!'))
        
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Fatal ERROR: {e}'))
            
        