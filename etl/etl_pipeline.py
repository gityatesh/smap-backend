from etl.extractor import Extractor
from etl.transformer import Transformer
from etl.loader import PostgresORMLoader
import pandas as pd

class ETLPipeline:
    def __init__(self, symbols:list, days:int = 30):
        self.days = days
        self.symbols = symbols
        
    def run(self):
        '''starts the extract->transform->load sequence'''
        #extracting
        extractor = Extractor()
        raw_data = extractor.extract(self.symbols, self.days)
        if not raw_data:
            print('Process failed at extraction!')
            return False
        
        #transforming
        transformer = Transformer(raw_data)
        transformed_file_path = transformer.transform()
        if transformed_file_path is None:
            print('Process stopped at transformation!')
            return False
        cleaned_df = pd.read_csv(transformed_file_path)
        if cleaned_df.empty:
            print('Empty Transformend file')
            return False
        
        
        #loading(django version)
        loader = PostgresORMLoader()
        try:
            loader.load(cleaned_df)
        except Exception as e:
            print(f'Process failed at loading! Error: {e}')
            return False
    
        print('Process completed successfully!')
        print('Final data securely staged in PostgreSQL vault.')
        return True
#testing
# if __name__ == "__main__":
#     # 1. Define the stocks we want to pull (using your favorites!)
#     symbols_to_track = ['AAPL', 'TSLA', 'TCS.NS']
    
#     # 2. Instantiate the pipeline (Build the car)
#     pipeline = ETLPipeline(symbols=symbols_to_track, days=30)
    
#     # 3. Execute the pipeline (Turn the key!)
#     pipeline.run()
    
    
    