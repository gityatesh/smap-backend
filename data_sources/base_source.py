import pandas as pd
from abc import ABC,abstractmethod

class BaseSource(ABC):
    """
    the blueprint for all external data sources. 
    whether we use Yahoo, Bloomberg, or a CSV file, it MUST implement these methods.
    every source must contain these two functions below
    """
    @abstractmethod
    def connect(self):
        '''establishes connection to the data provider'''
        pass
    
    @abstractmethod
    def fetch_data(self, symbols:list, days:int)->pd.DataFrame:
        '''fetch data from the data provider'''
        pass