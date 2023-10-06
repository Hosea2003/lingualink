from channels.generic.websocket import AsyncWebsocketConsumer
import json
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from django.shortcuts import get_object_or_404
from messaging.models import ThreadMessage
from messaging.serializers import MessageSerializer
from mod_user.models import LinguaUser
from .models import Message

class MessageConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user=None

    async def connect(self):
        self.user = self.scope["user"]

        if not self.user:
            return await self.close()

        await self.accept()

    async def disconnect(self, code):
        return await super().disconnect(code)

    async def receive(self, text_data=None, bytes_data=None):
        data:dict = json.loads(text_data)

        data_type=data.pop('type')

        if data_type=='send-message':
            await self.send_message(data)

        if data_type=='join-room':
            await self.join_room(data.get('other'))

    async def join_room(self, receiver_id):
        receiver =await sync_to_async(get_object_or_404)(LinguaUser, id=receiver_id)
        thread = await self.get_thread(self.user, receiver)
        room_name=f'thread_{thread.id}'
        
        # add to group
        await self.channel_layer.group_add(
            room_name,
            self.channel_name
        )

        print(room_name)

    async def send_message(self, data=None):
        receiver_id=data.get('receiver_id')
        receiver =await sync_to_async(get_object_or_404)(LinguaUser, id=receiver_id)
        thread = await self.get_thread(self.user, receiver)
        room_name=f'thread_{thread.id}'

        message = await self.send_message_db(receiver, data.get('content'))
        # add to group
        # self.channel_layer.group_add(
        #     room_name,
        #     self.channel_name
        # )

        await self.channel_layer.group_send(
            room_name,
            {
                'type':'send_message_event',
                'message':message
            }
        )

    async def send_message_event(self, event):

        await self.send(json.dumps({
            'type':'new-message',
            'message':event['message']
        }))

    @database_sync_to_async
    def get_thread(self, user1, user2):
        thread = ThreadMessage.objects.get_or_create_personal_thread(user1, user2)
        return thread
    

    @database_sync_to_async
    def send_message_db(self, receiver, content):
        message = Message.objects.create(
            receiver=receiver,
            sender=self.user,
            content=content
        )

        return MessageSerializer(message).data
        