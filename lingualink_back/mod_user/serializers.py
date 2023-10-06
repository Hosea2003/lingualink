from rest_framework import serializers
from .models import LinguaUser, ProfilePicture


class LinguaUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    birthdate = serializers.DateField()
    date_joined = serializers.DateTimeField(read_only=True)
    profile_picture=serializers.CharField(required=False)
    class Meta:
        model = LinguaUser
        fields = [
            'id',
            'email',
            'username',
            'password',
            'first_name',
            'last_name',
            'birthdate',
            'gender',
            'date_joined',
            "profile_picture"
        ]


class ValidateUserSerializer(serializers.Serializer):
    username = serializers.CharField()
    code = serializers.CharField()

class AuthSerializer(serializers.Serializer):
    username=serializers.CharField()
    password = serializers.CharField()

class ProfilePictureSerializer(serializers.ModelSerializer):
    class Meta:
        fields=['id', 'image_url']
        model = ProfilePicture

class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = LinguaUser
        fields=[
            'first_name',
            'last_name',
            'birthdate',
            'gender'
        ]