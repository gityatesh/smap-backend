import os
import django
import yfinance as yf

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smap_web.settings')
django.setup()

from stocks.models import Stock

def run_enrichment():
    print('Initializing Enrichment')
    stocks = Stock.objects.all()
    print(f'{stocks.count} stocks fetched!')
    
    for stock in stocks:
        try:
            print(f'Fetching data for {stock.symbol}....')
            ticker = yf.Ticker(stock.symbol)
            info = ticker.info
            
            name = info.get('shortName') or info.get('longName') or 'unknown'
            sector = info.get('sector', 'unknown')
            market_cap = str(info.get('marketCap', 'unknown'))
            
            #updating the django object
            stock.company_name = name
            stock.sector = sector
            stock.market_cap = market_cap
            
            stock.save()
            print(f'{stock.symbol}|{stock.company_name} updated')
            
        except Exception as e:
            print(f'Failed to fetch the stock {stock.symbol}')
            
    print ('Enrichment run completed!')
    
if __name__ == "__main__":
    run_enrichment()