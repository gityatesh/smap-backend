#simple program to extract all the data into csv format using pandas
from sql.database import DatabaseConnector
import pandas as pd
    
def export_to_csv():
    conn = DatabaseConnector().get_connection()
    query = '''
    SELECT s.symbol, s.company_name, s.sector, sp.trade_date, sp.open_price, sp.close_price, sp.volume
    FROM stocks s
    JOIN stock_prices sp
    ON s.id = sp.stock_id'''
    
    df = pd.read_sql_query(query, conn)
    df.to_csv('data/stock_export.csv', index=False)
    conn.close()
    print('data exported successfully')
    
        
if __name__ == '__main__':
    export_to_csv()
     
#we use csv over json because its easy to manage
#json has the complex nested structure, csv is preferred for tabular data        