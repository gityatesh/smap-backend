import pandas as pd
import os
def data_cleaning():
    pathtoxl = 'data/dirty_stock_prices.xlsx'
    try:
        df = pd.read_excel(pathtoxl)
        pathtocsv = 'data/dirty_stock_prices_v2.csv'
        try: 
            df.to_csv(pathtocsv, index= False)
        except FileNotFoundError:
            print(f'{pathtocsv} not found!')
    except FileNotFoundError:
        print(f'{pathtoxl} not found!')
        
    try:
        df = pd.read_csv(pathtocsv)
        duplicates = df.duplicated().sum()
        na = df.isnull().sum() 
         
        #creates a .txt summary inside the report folder
        filepath = os.path.join('report', 'data_quality_report.txt')
        with open(filepath, 'w', encoding='utf-8') as file:
            file.write('--------Cleanup report--------')
            file.write(f'missing value summary: {duplicates}')
            file.write(f'duplicate value summary: {na}')
            file.write('validation summary: ')
            file.write('cleaning summary: ')
            
        #drops the duplicate rows
        df=df.drop_duplicates()        
        #fix the , in close_price and change the dtype to float
        df['close_price'] = df['close_price'].astype(str).str.replace(',','.')
        df['close_price'] = df['close_price'].to_numeric(df['close_price'], error = 'coerce')
        df=df.dropna()
        
        #striping any extra space from symbols and moving it to upper case
        df['symbol'] = df['symbol'].str.strip().str.upper()
        
        rule1 = (df['close_price']>=0)&(df['open_price']>=0) &\
            (df['high_price']>=0)&(df['low_price']>=0)
        
        rule2 = (df['volume']>=0)
        rule3 = (df['high_price']>=df['open_price'])
        rule4 = (df['high_price']>=df['low_price'])
        
        df = df[rule1&rule2&rule3&rule4]
        
        
        
    except FileNotFoundError:
        print(f'{pathtocsv} not found!')