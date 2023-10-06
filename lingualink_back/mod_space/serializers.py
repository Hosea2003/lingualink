from rest_framework import serializers
from .models import *
from mod_user.serializers import LinguaUserSerializer
from .utils import check_language_code


class RoomSerializer(serializers.ModelSerializer):
    slug = serializers.CharField(read_only=True)
    host = LinguaUserSerializer(read_only=True)
    name = serializers.CharField(required=True)
    description = serializers.CharField(required=False)

    class Meta:
        model = Room
        fields = "__all__"


class RoomLanguageSerializer(serializers.ModelSerializer):
    host = LinguaUserSerializer(read_only=True)
    translator = LinguaUserSerializer(read_only=True)
    language=serializers.SerializerMethodField()

    class Meta:
        model = RoomLanguage
        fields = [
            "id", "host", "translator", "language"
        ]

    def get_language(self, obj):
        return check_language_code(obj.language_code)
    
class MessageSerializer(serializers.ModelSerializer):
    sender = LinguaUserSerializer(read_only=True)
    class Meta:
        fields = "__all__"
        model = RoomMessage