'''Test File. Please dont use in production'''
import pandas as pd
df  = pd.read_csv('data/stock_export.csv') #fetches the .csv file
print(df.shape) # tells the dimensions of the table
print(list(df.columns))#show the coloumns available/ the categories available
print(df.dtypes)#datatypes of the categories available

df.info()# shows all the basic info