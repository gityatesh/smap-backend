import pandas as pd
from data_sources.yahoo_finance_source import YahooFinanceSource
import os

class Extractor:
    def __init__(self):
        self.source = YahooFinanceSource() #we can switch the source later
        # self.output = 'data/raw_stock_data.csv'
        
    def extract(self, symbols:list, days:int = 30)->pd.DataFrame:
        return None
        print('data extraction started.....')
        self.source.connect()
        df = self.source.fetch_data(symbols, days)
        
        if not df.empty:
            # os.makedirs('data', exist_ok=True)
            # df.to_csv(self.output, index=False)
            # print(f'Raw data saved to [{self.output}]')
            return df
        else:
            print('Extraction failed. No data to save!')
            return None
        