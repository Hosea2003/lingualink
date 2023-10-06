from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response
from rest_framework.request import Request
from uuid import uuid4
from django.conf import settings
from django.utils import timezone
from datetime import datetime
from mod_user.models import AuthorizationCode, ValidationCode, LinguaUser
from mod_user.serializers import LinguaUserSerializer, ValidateUserSerializer, AuthSerializer
from mod_user.utils import create_code, check_validation_code
from services.gmail import send_email
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from django.db.models import Q


@api_view(["POST"])
def register_user(request: Request):
    user_data = request.data

    user_serializer = LinguaUserSerializer(data=user_data)

    if not user_serializer.is_valid():
        return Response(user_serializer.errors)

    user: LinguaUser = user_serializer.save()
    # send a validation code
    validation = create_code(user)

    send_email("Your validation code", user.email, "Thanks for choosing Lingualink. "
                                                   "Here is your validation code: {}".format(validation.code))

    return Response({"message": "Validation code sent"}, status=status.HTTP_201_CREATED)


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client
    callback_url = "http://127.0.0.1/accounts/google/login/callback/"


@api_view(["POST"])
def validate_account(request: Request):
    data = request.data
    result = check_validation_code(data)

    if not result.get("success"):
        return Response({"message": result.get("message")}, status=result.get("status"))

    user_code = result.get("message")

    user = user_code.user_to_validate
    user.account_verified = True
    user.save()
    for code in ValidationCode.objects.filter(user_to_validate=user):
        code.delete()

    refresh = RefreshToken.for_user(user)

    return Response({
        "refresh":str(refresh),
        "access":str(refresh.access_token)
    }, status=status.HTTP_200_OK)


@api_view(["POST"])
def get_validation_code(request: Request):
    data = request.data
    username = data.get("username")

    if not username:
        return Response({"message": "Provide an username"}, status=status.HTTP_400_BAD_REQUEST)

    user = LinguaUser.objects.filter(username=username).first()
    if not user:
        return Response({"message": "user not found"}, status=status.HTTP_404_NOT_FOUND)

    validation = create_code(user)
    send_email("Validation code", user.email, "Here is your validation code {}"
               .format(validation.code))

    return Response({"message": "validation code sent"}, status=status.HTTP_200_OK)


@api_view(["POST"])
def obtain_token(request: Request):
    data = request.data
    serializer = AuthSerializer(data=data)
    if not serializer.is_valid():
        return Response(serializer.error_messages, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=data.get("username"), password=data.get("password"))

    if not user:
        return Response({"errors": "Unable to log in with provided credentials"}, status=status.HTTP_400_BAD_REQUEST)

    if not user.account_verified:
        return Response({"errors":"Account not verified, enter your validation code"}, status=status.HTTP_403_FORBIDDEN)

    refresh = RefreshToken.for_user(user)

    return Response({
        "refresh":str(refresh),
        "access":str(refresh.access_token)
    })

@api_view(["GET"])
@permission_classes([IsAuthenticatedOrReadOnly])
def get_users(request:Request):
    search = request.query_params.get("search")
    users = LinguaUser.objects.filter(username__icontains=search.lower())
    return Response(LinguaUserSerializer(users, many=True).data)

@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def get_user_email(request:Request):
    search = request.query_params.get("search")
    users=LinguaUser.objects.filter(email=search.lower())
    return Response(LinguaUserSerializer(users, many=True).data)

@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def get_user_username(request:Request):
    search = request.query_params.get("search")
    users=LinguaUser.objects.filter(username=search.lower())
    return Response(LinguaUserSerializer(users, many=True).data)

@api_view(["POST"])
def get_code_change_password(request):
    email=request.data.get('email', None)

    if not email:
        return Response("Provide email", status=status.HTTP_400_BAD_REQUEST)
    
    user=get_object_or_404(LinguaUser, Q(email=email)|Q(username=email))

    # send code
    validation_code:ValidationCode = create_code(user)

    send_email("Code to reset password", user.email, "Here your code to reset your password: "+validation_code.code)

    return Response("Code sent")

@api_view(["POST"])
def get_authorization_code(request:Request):
    data = request.data
    result = check_validation_code(data)

    if not result.get("success"):
        return Response({"message": result.get("message")}, status=result.get("status"))
    
    user_code = result.get("message")

    user = user_code.user_to_validate
    
    authorization=AuthorizationCode.objects.create(
        user=user
    )
    
    return Response({"code":authorization.code})

@api_view(["POST"])
def change_password_with_code(request:Request):
    code = request.data.get('code')
    new_password = request.data.get('new_password')
    # email = request.data.get('email')

    # user:LinguaUser = get_object_or_404(LinguaUser, email=email)

    # verify code
    valid = AuthorizationCode.objects.filter(
        code=code
    ).first()

    if not valid:
        return Response("You don't have permission to change permission")

    user = valid.user
    
    if not user.account_verified:
        user.account_verified=True

    user.set_password(new_password)
    user.save()

    valid.delete()

    refresh = RefreshToken.for_user(user)

    return Response({
        "refresh":str(refresh),
        "access":str(refresh.access_token)
    }, status=status.HTTP_200_OK)