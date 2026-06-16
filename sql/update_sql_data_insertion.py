from datetime import datetime
import pandas as pd
def update_insert_sql():
    
    df= pd.read_csv('data/clean_stock_prices.csv')
    current_time = datetime.now().strftime("%B %d, %Y at %I:%M %p")

    with open('sql/insert_data.sql', 'w') as file:
        date = f'--last updated: {current_time}\n'
        file.write(date)
        
        delete_sql = """-- 0. Wipe Old Data
DELETE FROM stock_prices;
DELETE FROM stocks;\n\n"""
        file.write(delete_sql)
        
        
        master_stocks_sql = """-- 1. Master Stocks Table (Dimension)
INSERT INTO stocks (symbol, company_name, sector, market_cap) VALUES
('RELIANCE', 'Reliance Industries', 'Energy', 'Large Cap'),
('TCS', 'Tata Consultancy Services', 'Technology', 'Large Cap'),
('INFY', 'Infosys', 'Technology', 'Large Cap'),
('HDFCBANK', 'HDFC Bank', 'Banking', 'Large Cap'),
('ICICIBANK', 'ICICI Bank', 'Banking', 'Large Cap'),
('ITC', 'ITC Limited', 'Consumer Goods', 'Large Cap'),
('BHARTIARTL', 'Bharti Airtel', 'Telecom', 'Large Cap'),
('LT', 'Larsen & Toubro', 'Infrastructure', 'Large Cap'),
('HINDUNILVR', 'Hindustan Unilever', 'Consumer Goods', 'Large Cap'),
('SBIN', 'State Bank of India', 'Banking', 'Large Cap');\n
"""
        file.write(master_stocks_sql)
            
        for index, row in df.iterrows():
            # Notice we added 'stock_id' to the columns list, 
            # and a (SELECT id FROM stocks WHERE symbol = ...) to the VALUES list!
            query = f"INSERT INTO stock_prices (stock_id, symbol, trade_date, open_price, high_price, low_price, close_price, volume) " \
                    f"VALUES ((SELECT id FROM stocks WHERE symbol='{row['symbol']}'), '{row['symbol']}', '{row['date']}', {row['open_price']}, {row['high_price']}, " \
                    f"{row['low_price']}, {row['close_price']}, {row['volume']});\n"
            file.write(query)
            
if __name__=='__main__':
    update_insert_sql()