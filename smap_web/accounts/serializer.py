#for creating new users (Sign-up page backend model)

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import InvestorProfile

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
        