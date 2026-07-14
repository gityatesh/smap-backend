from data_sources.base_source import BaseSource
import pandas as pd
from datetime import datetime, timedelta
import yfinance as yf

import time
import random    
import requests

# custom session to spoof real webbrowser (to avoid too many requests error)
yfinance_session = requests.Session()
yfinance_session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
})

class YahooFinanceSource(BaseSource):
    
    def connect(self):
        print('Connected to Yahoo successfully!')
        
    def fetch_data(self, symbols:list, days:int=30)->pd.DataFrame:
        print('Fetching data from Yahoo.......')
        enddate = datetime.now()
        startdate = enddate - timedelta(days=days)
        
        all_stock_data = []
        
        for symbol in symbols:
            print(f'     ->pulling {symbol}')
            ticker = yf.Ticker(symbol)
            df = ticker.history(start= startdate, end=enddate)
            
            if df.empty:
                print(f'No data for {symbol}')
                continue
            
            # yfinance sets the Date as the index. We need it as a normal column.
            df = df.reset_index()
            df['symbol'] = symbol
            all_stock_data.append(df)
            
            # Force Python to pause for 2-4 seconds before the next symbol  
            time.sleep(random.uniform(2, 4))
            
        if all_stock_data:
            final_df = pd.concat(all_stock_data, ignore_index=True)
            print('Data sucessfully fetched and combined')
            return final_df
        
        else:
            print('Failed to fetch any data!')
            return pd.DataFrame()            
            