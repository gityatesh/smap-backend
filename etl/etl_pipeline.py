from etl.extractor import Extractor
from etl.transformer import Transformer
from etl.loader import Loader

class ETLPipeline:
    def __init__(self, symbols:list, days:int = 30):
        self.days = days
        self.symbols = symbols
        
    def run(self):
        '''starts the extract->transform->load sequence'''
        extractor = Extractor()
        raw_file = extractor.extract(self.symbols, self.days)
        if not raw_file:
            print('Process failed at extraction!')
            return False
        
        transformer = Transformer(raw_file)
        transformed_file = transformer.transform()
        if not transformed_file:
            print('Process stopped at transformation!')
            return False
        
        loader = Loader(transformed_file)
        loaded_file = loader.load()
        if not loaded_file:
            print('Process failed at loading!')
            return False
        
        print('Process completed successfully!')
        print(f'Final data staged at {loaded_file}')
        return True
#testing
if __name__ == "__main__":
    target_stocks = ['TCS.NS', 'INFY.NS', 'SBIN.NS', 'HDFCBANK.NS']
    pipeline = ETLPipeline(symbols = target_stocks, days = 30)
    pipeline.run()