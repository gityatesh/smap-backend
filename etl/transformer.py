import pandas as pd
import os
from data_sources.yahoo_finance_source import YahooFinanceSource
from etl.extractor import Exctractor
from 

class Transformer:
    def __init__(self, input_file = 'data/raw_stock_data.csv'):
        self.input_file = input_file
        self.source = YahooFinanceSource()
        
    def transform(self):
        pass
        