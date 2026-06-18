import pandas as pd
import os
def import_tranform_load():
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
        initial_count = len(df)
        
        duplicates = df.duplicated().sum()
        na = df.isnull().sum().sum()
        
         #fix the , in close_price and change the dtype to float
        df['close_price'] = df['close_price'].astype(str).str.replace(',','.')
        df['close_price'] = pd.to_numeric(df['close_price'], errors = 'coerce')
        #striping any extra space from symbols and moving it to upper case
        df['symbol'] = df['symbol'].str.strip().str.upper()
        df['date'] = pd.to_datetime(df['date'], errors='coerce').dt.strftime('%Y-%m-%d')
        
        #drops the duplicate rows
        df=df.drop_duplicates()        
        df=df.dropna()
        
        rule1 = (df['close_price']>=0)&(df['open_price']>=0) &\
            (df['high_price']>=0)&(df['low_price']>=0)
        rule1_fails = rule1_fails = len(df[(df['close_price'] < 0) | (df['open_price'] < 0) |\
            (df['high_price'] < 0) | (df['low_price'] < 0)])
        
        rule2 = (df['volume']>=0)
        rule2_fails = len(df[df['volume']<0])
        
        rule3 = (df['high_price']>=df['open_price'])
        rule3_fails = len(df[df['high_price']<df['open_price']])
        
        rule4 = (df['high_price']>=df['low_price'])
        rule4_fails = len(df[df['high_price']<df['low_price']])
            
        df = df[rule1&rule2&rule3&rule4]
        final_fail_count  = len(df)
         
         
        #creates a .txt summary inside the report folder
        filepath = os.path.join('report', 'data_quality_report.txt')
        with open(filepath, 'w', encoding='utf-8') as file:
            
            file.write('--------Cleanup report--------\n')
            file.write(f'missing value summary: {na}\n')
            file.write(f'duplicate value summary: {duplicates}\n')
            
            file.write('\n--------Validation summary--------\n')
            file.write(f'Negative price failures: {rule1_fails}\n')
            file.write(f'Negative volume failures: {rule2_fails}\n')
            file.write(f'High < Open failures: {rule3_fails}\n')
            file.write(f'High < Low failures: {rule4_fails}\n')
            
            file.write('\n--------Cleaning summary--------\n')
            file.write(f'Starting records: {initial_count}\n')
            file.write(f'Final clean records: {final_fail_count}\n')
            file.write(f'Total bad rows deleted: {initial_count - final_fail_count}\n')
        print('Report created successfully!!')
            
            
        
        df.to_csv('data/clean_stock_prices.csv', index=False)
        
        
        
    except FileNotFoundError:
        print(f'{pathtocsv} not found!')
        
        
if __name__=="__main__":
    import_tranform_load()