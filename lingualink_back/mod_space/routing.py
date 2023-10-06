from django.urls import path
from .consumers.message_consumer import MessageConsumer
from .consumers.room_consumer import RoomConsumer

websocket_urlpatterns=[
    # path('room/<str:slug>/<str:code>', MessageConsumer.as_asgi()),
    path("room", RoomConsumer.as_asgi())
]