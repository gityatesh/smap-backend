#for creating new users (Sign-up page backend model)

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import InvestorProfile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class RegisterSerializer(serializers.ModelSerializer):
    #definig password
    password = serializers.CharField(write_only = True, required = True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']            
        )
        
        InvestorProfile.objects.create(user = user)
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        data['username'] = self.user.username
        data['email'] = self.user.email
        
        # DEFENSIVE CHECK: Safely try to get the balance
        # Note: If your models.py uses a related_name like 'investor_profile', 
        # change 'investorprofile' below to match it exactly!
        if hasattr(self.user, 'investorprofile'):
            data['balance'] = float(self.user.investorprofile.cash_balance)
        else:
            # If it's an admin or old user without a wallet, give them a safe default
            data['balance'] = 0.0 

        return data