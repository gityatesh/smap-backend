import sys
import os
import django

# connecting our etl pipeline to django
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__),'..','smap_web')))
#choosing default settings file
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smap_web.settings')
django.setup() #booting up our django

# now we can import our database models
from stocks.models import DataSource, Stock, StockPrice

class PostgresORMLoader:
    def __init__(self, source_name = 'Yahoo Finance'):
        self.source_name = source_name
        
    def load(self,df,raw_json_payload=None):
        '''Takes a cleaned Pandas DataFrame and saves it to PostgreSQL.'''
        print(f'Connecting to django ORM.....\n Loading {len(df)} records')
        
        #1st: updating the datasource (weather its yahoo or some other source)
        source, created = DataSource.objects.get_or_create(
            name = self.source_name,
            defaults={'api_url': 'https://finance.yahoo.com'}
        )
        
        #if we have raw_json_payload
        source.raw_json = raw_json_payload
        source.save()
        
        #iterating through pandas dataframe
        for index, row in df.iterrows():
            
            #creating the stock table (dimension table)
            stock, stock_create = Stock.objects.get_or_create(
                symbol = row['symbol'],
                defaults={
                    'company_name' : row.get('company_name', 'unknown'),
                    'sector' : row.get('sector', 'unknown'),
                    'market_cap' : str(row.get('market_cap', 'unknown')),
                    'source' : source
                }
            )
            
            #creating table for storing stock prices (fact table)
            StockPrice.objects.update_or_create(
                stock = stock,
                trade_date = row['date'],
                defaults={
                    'open_price':row['open_price'],
                    'high_price': row['high_price'],
                    'low_price':row['low_price'],
                    'close_price':row['close_price'],
                    'volume':row['volume']
                }
            )
        print('Data injection into database successfull!')            