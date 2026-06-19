import pandas as pd
import os
from datetime import datetime, timezone as tz

class Transformer:
    def __init__(self, input_file = 'data/raw_stock_data.csv'):
        self.input_file = input_file
        self.output_file = 'data/transformed_stock_data.csv'
        
    def transform(self):
        '''cleans the data'''
        if not os.path.exists(self.input_file):
            print('File doesnot exist for transformation!')
            return 
        print('Data transformation started.....')
        df = pd.read_csv(self.input_file)
        
        '''coverting columns to lowercase, renaming the columns'''
        df.columns = [col.lower().replace(' ', '_') for col in df.columns] #converting to lowercase
        
        '''only have required columns. remove the rest'''
        important_columns = ['date', 'symbol', 'open', 'high', 'low', 'close', 'volume']
        avl_columns = [c for c in important_columns if c in df.columns]
        df = df[avl_columns]
        
        rename = {
            'open': 'open_price',
            'high': 'high_price',
            'low': 'low_price',
            'close':'close_price'
        }
        df.rename(columns=rename, inplace=True)
        
        '''standerdizing date'''
        if 'date' in df.columns:
            df['date'] = pd.to_datetime(df['date'], utc = True).dt.tz_localize(None).dt.strftime('%Y-%m-%d')
            
        df.to_csv(self.output_file, index=False)
        print(f'File transformed successfully! to {self.output_file}')
        return self.output_file
        