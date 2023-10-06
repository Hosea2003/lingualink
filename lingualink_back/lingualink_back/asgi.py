import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

from mod_space.middleware import WebsocketAuthMiddleware
import mod_space.routing
import messaging.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lingualink_back.settings')

application = ProtocolTypeRouter({
    "http":get_asgi_application(),
    "websocket":WebsocketAuthMiddleware(
        URLRouter(mod_space.routing.websocket_urlpatterns+
                  messaging.routing.urlpatterns)
    )
})
