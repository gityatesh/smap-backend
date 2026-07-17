from django.contrib import admin
from .models import Transaction, WatchlistGroup, WatchlistItem 

admin.site.register(Transaction)
admin.site.register(WatchlistGroup)
admin.site.register(WatchlistItem)