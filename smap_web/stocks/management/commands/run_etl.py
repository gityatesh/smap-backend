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
    # =========================
    # 🇺🇸 US Stocks
    # =========================
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META',
    'NVDA', 'TSLA', 'AMD', 'NFLX', 'INTC',
    'ORCL', 'CRM', 'ADBE', 'CSCO', 'QCOM',

    # US Finance
    'JPM', 'BAC', 'WFC', 'GS', 'MS',
    'C', 'AXP', 'BLK', 'SCHW', 'USB',

    # US Healthcare
    'JNJ', 'PFE', 'MRK', 'ABBV', 'LLY',
    'UNH', 'TMO', 'ABT', 'BMY', 'DHR',

    # US Consumer
    'KO', 'PEP', 'MCD', 'SBUX', 'NKE',
    'DIS', 'COST', 'WMT', 'HD', 'LOW',

    # =========================
    # 🇮🇳 Indian Stocks (NSE)
    # =========================
    'RELIANCE.NS',
    'TCS.NS',
    'INFY.NS',
    'HDFCBANK.NS',
    'ICICIBANK.NS',
    'SBIN.NS',
    'AXISBANK.NS',
    'KOTAKBANK.NS',
    'LT.NS',
    'ITC.NS',
    'BHARTIARTL.NS',
    'HINDUNILVR.NS',
    'ASIANPAINT.NS',
    'MARUTI.NS',
    'SUNPHARMA.NS',
    'ULTRACEMCO.NS',
    'BAJFINANCE.NS',
    'TITAN.NS',
    'ADANIENT.NS',
    'ADANIPORTS.NS',
    'NTPC.NS',
    'POWERGRID.NS',
    'TATAMOTORS.NS',
    'M&M.NS',
    'WIPRO.NS',
    'TECHM.NS',
    'HCLTECH.NS',
    'NESTLEIND.NS',
    'JSWSTEEL.NS',
    'TATASTEEL.NS',
    'INDUSINDBK.NS',
    'BANKBARODA.NS',
    'PNB.NS',
    'CANBK.NS',
    'IDFCFIRSTB.NS',
    'LTIM.NS',
    'PERSISTENT.NS',
    'COFORGE.NS',
    'MPHASIS.NS',
    'OFSS.NS',
    'EICHERMOT.NS',
    'HEROMOTOCO.NS',
    'BAJAJ-AUTO.NS',
    'TVSMOTOR.NS',
    'ASHOKLEY.NS',

    # =========================
    # 📈 Indices
    # =========================
    '^NSEI',
    '^BSESN',
    '^NSEBANK',
    '^DJI',
    '^IXIC',
    '^GSPC',
    '^RUT',
    '^VIX',

    # =========================
    # 💰 ETFs
    # =========================
    'SPY',
    'QQQ',
    'DIA',
    'VOO',
    'VTI',
    'ARKK',
    'GLD',
    'SLV',
    'XLK',
    'XLF',

    # =========================
    # 🪙 Crypto
    # =========================
    'BTC-USD',
    'ETH-USD',
    'SOL-USD',
    'BNB-USD',
    'XRP-USD',
    'DOGE-USD',
    'ADA-USD',
    'AVAX-USD',

    # =========================
    # 🛢 Commodities
    # =========================
    'GC=F',
    'SI=F',
    'CL=F',
    'NG=F',
    'HG=F',

    # =========================
    # 💱 Forex
    # =========================
    'USDINR=X',
    'EURUSD=X',
    'GBPUSD=X',
    'JPY=X',
    'AUDUSD=X'
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
            
        