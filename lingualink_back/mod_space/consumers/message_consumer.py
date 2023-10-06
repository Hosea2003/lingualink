from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from mod_space.utils import get_room_by_slug, get_language_by_code
import json

from mod_user.models import LinguaUser
from mod_user.serializers import LinguaUserSerializer


class MessageConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.language = None
        self.room_name = None
        self.room_group_name = None
        self.language_code = None
        self.user = None
        self.room = None

    async def connect(self):
        kwargs = self.scope["url_route"]["kwargs"]
        self.room_name = kwargs.get("slug")
        self.language_code = kwargs.get("code")
        self.room_group_name = "chat_%s_%s" % (self.room_name, self.language_code)
        self.user = self.scope["user"]

        if not self.user:
            return self.close()

        self.room = await get_room_by_slug(self.room_name, self.user)

        if not self.room:
            return self.close()

        # check language code
        self.language = await get_language_by_code(self.room, self.language_code)

        if not self.language:
            return self.close()

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type":"on_connected",
                "user":self.user
            }
        )

    async def on_connected(self, event):
        user = event["user"]
        await self.send(text_data=json.dumps({
            "message":user.username+" join the room"
        }))

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data=None):
        message = json.loads(text_data)["message"]
        user_id = json.loads(text_data).get("user_id")

        if not user_id:
            return

        user = await self.get_user_by_id(user_id)
        if not user:
            return

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type":"chat_message",
                "message":message,
                "user":user
            }
        )

    async def chat_message(self, event):
        message= event["message"]
        user=event["user"]

        await self.send(text_data=json.dumps({
            "message":message,
            "user":LinguaUserSerializer(user).data
        }))

    @database_sync_to_async
    def get_user_by_id(self, user_id):
        return LinguaUser.objects.filter(id=user_id).first()
