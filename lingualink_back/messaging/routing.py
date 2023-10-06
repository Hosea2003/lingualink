from django.urls import path
from .consumers import MessageConsumer

urlpatterns=[
    path('message', MessageConsumer.as_asgi())
]