from etl.extractor import Extractor
from etl.transformer import Transformer
from etl.loader import PostgresORMLoader
from etl.scraper_extractor import WebScraperExtractor 


class ETLPipeline:
    def __init__(self, symbols:list, days:int):
        self.days = days
        self.symbols = symbols

    def run_pipeline(self):
        print("Starting In-Memory ETL Pipeline...")
        
        # 1. Extract (Primary Engine: API)
        print(" Attempting primary extraction via API...")
        extractor = Extractor()
        raw_data = extractor.extract(self.symbols, self.days)
        
        # 1.5 Extract (Fallback Engine: HTML Scraper)
        if raw_data is None or raw_data.empty:
            print(" API Failed or returned empty! Booting up Web Scraper Fallback...")
            scraper = WebScraperExtractor()
            scraper_data = scraper.extract_live_batch(self.symbols)
            
            # THE FIX: Assign the scraper's data back to the main variable
            raw_data = scraper_data
            
        # If BOTH fail, abort the mission
        if raw_data is None or raw_data.empty:
            print(" FATAL: Both API and Scraper failed. Aborting pipeline.")
            return False

        # 2. Transform 
        transformer = Transformer()
        clean_df = transformer.transform(raw_data)
        
        if clean_df is None or clean_df.empty:
            print('Process stopped at transformation! Empty dataframe returned.')
            return False

        # 3. Load 
        loader = PostgresORMLoader()
        try:
            loader.load(clean_df)
        except Exception as e:
            print(f'Process failed at loading! Error: {e}')
            return False

        print("Pipeline completed successfully! No CSVs were harmed.")
        return True


if __name__ == "__main__":
    # Define the stocks we want to pull
    symbols_to_track = [
        'AAPL', 'TSLA', 'RELIANCE.NS', 'TCS.NS', 'INFY.NS', 
        'HDFCBANK.NS', 'ICICIBANK.NS', 'ITC.NS', 'BHARTIARTL.NS', 
        'LT.NS', 'HINDUNILVR.NS', 'SBIN.NS'
    ]
    
    # Instantiate the pipeline
    pipeline = ETLPipeline(symbols=symbols_to_track, days=100)
    
    # Execute the pipeline
    pipeline.run_pipeline()