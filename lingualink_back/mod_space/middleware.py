from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.backends import TokenBackend
from django.conf import settings
from rest_framework_simplejwt.exceptions import TokenBackendError


@database_sync_to_async
def get_user_by_jwt(jwt):
    try:
        jwt_authentication=JWTAuthentication()
        valid_token = jwt_authentication.get_validated_token(jwt)
        user = jwt_authentication.get_user(valid_token)
    except:
        user = None
    return user

class WebsocketAuthMiddleware:
    def __init__(self, app):
        self.app=app

    async def __call__(self, scope, receive, send):
        query_string = scope["query_string"]
        query_params=query_string.decode()
        query_dict = parse_qs(query_params)
        token = query_dict["token"][0]
        user = await get_user_by_jwt(token)
        scope["user"]=user
        return await self.app(scope, receive, send)
