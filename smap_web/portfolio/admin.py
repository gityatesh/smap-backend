from django.contrib import admin
from .models import Watchlist, Transaction

admin.site.register(Watchlist)
admin.site.register(Transaction)