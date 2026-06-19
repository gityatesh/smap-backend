import shutil
import os

class Loader:
    def __init__(self, input_file = 'data/transformed_stock_data.csv'):
        self.input_file = input_file
        self.output_file = 'data/loaded_stock_data.csv'
        
    def load(self):
        if not os.path.exists(self.input_file):
            print('Transformed data not exists or file location invalid!')
            return None
        
        
        '''this is because if in future we want to switch to online warehouses like aws etc. we can easily switch'''
        shutil.copy(self.input_file, self.output_file)
        print(f'Loading complete to {self.output_file}')
        return self.output_file