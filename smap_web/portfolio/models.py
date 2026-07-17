from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User
# We import your existing Stock model to link them together
from stocks.models import Stock  

class WatchlistGroup(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='watchlist_groups')
    name = models.CharField(max_length=100)  # This will hold names like "Telecom", "Tech"
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # This prevents a user from accidentally creating two watchlists with the exact same name
        unique_together = ('user', 'name')

    def __str__(self):
        return f"{self.user.username} - {self.name}"


class WatchlistItem(models.Model):
    group = models.ForeignKey(WatchlistGroup, on_delete=models.CASCADE, related_name='items')
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE) # Make sure 'Stock' matches your actual stock model name!
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # This prevents the exact same stock from being added to the same folder twice
        unique_together = ('group', 'stock')

    def __str__(self):
        return f"{self.stock.symbol} in {self.group.name}"


class Transaction(models.Model):
    TRANSACTION_TYPES = (
        ('BUY', 'Buy'),
        ('SELL', 'Sell'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    stock = models.ForeignKey(Stock, on_delete=models.PROTECT, related_name='trades')
    transaction_type = models.CharField(max_length=4, choices=TRANSACTION_TYPES)
    
    quantity = models.PositiveIntegerField()
    execution_price = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_type} {self.quantity} shares of {self.stock.symbol} by {self.user.username}"
    
    @property
    def total_value(self):
        return self.quantity * self.execution_price
