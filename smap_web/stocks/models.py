from django.db import models
'''this file stores our data architecture which we'll import from our database'''
class DataSource(models.Model):
    '''where is our data coming from, stores the name and the url link'''
    name = models.CharField(max_length=100, unique=True)
    api_url = models.URLField(blank=True, null=True)
    
    #to automatically edit the current date
    last_fetched_date = models.DateTimeField(auto_now=True, null=True)
    #will tell django to create a table for raw data injection
    raw_json = models.JSONField(blank=True, null=True)

    def __str__(self):
        return self.name
    
class Stock(models.Model):
    '''Holds static company information. writing code in python instead of sql'''
    symbol = models.CharField(max_length=20, unique=True)
    company_name = models.CharField(max_length=255)
    sector = models.CharField(max_length=100)
    market_cap = models.CharField(max_length=50)
    '''  for our foreign key:
    this shows that if the yahoo ever stops or go down, then just remove yahoo(parent) and leave the stocks(children)'''
    source = models.ForeignKey(DataSource, on_delete=models.SET_NULL, null=True)
    
    def __str__(self):
        return self.symbol

class StockPrice(models.Model):
    '''holds stock prices information. writing code in python instead of sql'''
    '''foreign key: one to many
    if any company goes bankrupt tomorrow then the company(parent) and its data(children) will be deleted completly'''
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, related_name='prices')
    # rest of the schema
    trade_date = models.DateField()
    open_price = models.DecimalField(max_digits=15, decimal_places=4)
    high_price = models.DecimalField(max_digits=15, decimal_places=4)
    low_price = models.DecimalField(max_digits=15, decimal_places=4)
    close_price = models.DecimalField(max_digits=15, decimal_places=4)
    volume = models.BigIntegerField()
    
    class Meta:
        '''prevents from printing the same stock again and again'''
        unique_together = ('stock', 'trade_date')
    
    def __str__(self):
        return f'{self.stock} - {self.trade_date}'