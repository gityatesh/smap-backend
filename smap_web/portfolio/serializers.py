from rest_framework import serializers
from .models import Watchlist,Transaction
from stocks.models import Stock

class WatchlistSerializer(serializers.ModelSerializer):
    stock_symbol = serializers.CharField(source = 'stock.symbol', read_only = True)
    
    class Meta:
        model = Watchlist
        fields = ['user', 'stock', 'stock_symbol', 'added_at']
        read_only_fields = ['user', 'added_at']
        

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id','user','stock','stock_symbol', 'transaction_type','execution_price','timestamp']
        read_only_fields = ['user', 'timestamp', 'execution_price'] #data will come from the stcokdata from the most recent date