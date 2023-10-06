from .models import Message
from rest_framework import serializers

from mod_user.serializers import LinguaUserSerializer

class MessageSerializer(serializers.ModelSerializer):
    sender = LinguaUserSerializer(read_only=True)
    receiver = LinguaUserSerializer(read_only=True)

    class Meta:
        model = Message
        fields='__all__'