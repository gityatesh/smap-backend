from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User
# We import your existing Stock model to link them together
from stocks.models import Stock  

class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='watchlists')
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, related_name='watched_by')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Prevents a user from adding the same stock to their watchlist twice
        unique_together = ('user', 'stock')

    def __str__(self):
        return f"{self.user.username} watching {self.stock.symbol}"


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
