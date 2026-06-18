import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sql.database import DatabaseConnector
import os


class GraphingService:
    def __init__(self):
        self.db = DatabaseConnector()
        self.export = 'report/graphs'
        os.makedirs(self.export, exist_ok=True)
        sns.set_theme(style='darkgrid')
        
    def timeseries(self, symbol:str):
        query = '''SELECT sp.trade_date, sp.close_price
        FROM stock_prices sp
        JOIN stocks s
        ON s.id = sp.stock_id
        WHERE sp.symbol = %s
        ORDER BY sp.trade_date ASC;'''
        
        rows = self.db.execute_read_query(query, (symbol,))
        if not rows:
            print(f'{symbol} not found!')
            return 
        df = pd.DataFrame(rows)
        
        plt.figure(figsize=(10, 6))
        sns.lineplot(data=df, x = 'trade_date', y='close_price', marker = 'o')
        plt.title(f'{symbol}-Closing Price Trend', fontsize = 14, fontweight = 'bold')
        plt.xlabel('Trade Date', fontsize = 12)
        plt.ylabel('Close Price', fontsize = 12)
        plt.xticks(rotation=45)#to rotate labels on x axis to that they donot overwrite
        plt.tight_layout()
        
        filepath = os.path.join(self.export, f'{symbol}_trend.png')
        plt.savefig(filepath)
        plt.show()
        plt.close()
        print(f'TimeSeries graph for {symbol} created successfully!')
        
    def bargraphvol(self):
        query = '''SELECT s.symbol, AVG(sp.volume) as average_volume
        FROM stock_prices sp
        JOIN stocks s
        ON s.id = sp.stock_id
        GROUP BY s.symbol
        ORDER BY average_volume DESC;'''
        
        rows=self.db.execute_read_query(query)
        if not rows:
            print('Error. Cannot find database!')
            
        df = pd.DataFrame(rows)
        plt.figure(figsize=(10, 6))
        sns.barplot(data=df, x='symbol',y='average_volume', hue = 'symbol', palette='viridis', legend = False)
        plt.title('Average Trading Volume by Stock', fontsize = 14, fontweight = 'bold')
        plt.xlabel('Stock', fontsize = 12)
        plt.ylabel('Average Volume', fontsize = 12)
        plt.xticks(rotation=45)
        
        filepath = os.path.join(self.export, 'market_volume.png')
        plt.savefig(filepath)
        plt.show()
        plt.close()
        print('Volume Bar Graph created successfully!')
        
    def price_fluctuation_graph(self):
        query = '''SELECT s.symbol, AVG(sp.high_price-sp.low_price) as volatility    
        FROM stock_prices sp
        JOIN stocks s
        ON s.id = sp.stock_id
        GROUP BY s.symbol
        ORDER BY volatility;'''
        
        rows= self.db.execute_read_query(query)
        df = pd.DataFrame(rows)
        
        plt.figure(figsize=(10, 6))
        sns.barplot(data=df, x='symbol', y='volatility', hue = 'symbol', palette='magma', legend = False)
        plt.title('Stock Volatility Analysis', fontsize = 16, fontweight = 'bold')
        plt.xlabel('Stock', fontsize = 12)
        plt.ylabel('Average Price Spread', fontsize = 12)
        plt.xticks(rotation=45)
        
        filepath = os.path.join(self.export, 'volatility_analysis.png')
        plt.savefig(filepath)
        plt.show()
        plt.close()
        print('Volatility graph printed successfully!')