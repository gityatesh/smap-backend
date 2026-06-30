import yfinance as yf
from django.core.management.base import BaseCommand
from stocks.models import Stock

class Command(BaseCommand):
    help = 'Sweeps the database to enrich stock profiles with corporate metadata (Sector, Industry, Market Cap)'
    
    def handle(self,*args, **kwargs):
        self.stdout.write('Initiating Enrichment...')
        tracked_stocks = Stock.objects.all()
        if not tracked_stocks.exists():
            self.stdout.write(self.style.WARNING("No Stocks were found in database. Aborting the process! Run the ETL pipeline 1st."))
            return 
        updated_count=0
        for stock in tracked_stocks:
            self.stdout.write(f'Fetching metadata for {stock.symbol}....')
            try:
                ticker = yf.Ticker(stock.symbol)
                info = ticker.info
                if not info:
                    self.stdout.write(self.style.WARNING(f'No metadata found for {stock.symbol}!'))
                    continue
                
                #feting the metadata that is missing from our database
                company_name = info.get('shortName') or info.get('longName') or 'unknown'
                sector = info.get('sector','unknown')
                market_cap = str(info.get('marketCap', 'unknown'))
        
                #updating the data unknown -> 
                stock.company_name=company_name
                stock.sector=sector
                stock.market_cap = market_cap
                
                stock.save()
                self.stdout.write(self.style.SUCCESS(f"     Updated: {company_name} | {sector} | Mkt Cap: {market_cap}"))
                updated_count += 1

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"     Failed to enrich metadata for {stock.symbol}: {e}"))

        self.stdout.write(self.style.SUCCESS(f"Enrichment completed successfully! Profile metrics updated for {updated_count} assets."))
                