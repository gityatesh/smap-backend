from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class InvestorProfile(models.Model):
    # Links directly to Django's built-in secure User table
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='investor_profile')
    
    # Financial data
    available_cash = models.DecimalField(max_digits=12, decimal_places=2, default=100000.00)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

