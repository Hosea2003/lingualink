from channels.generic.websocket import AsyncWebsocketConsumer
import json
from mod_space.models import Room, RoomLanguage
from mod_user.models import LinguaUser
from mod_user.serializers import LinguaUserSerializer
from channels.db import database_sync_to_async
import uuid

class RoomConsumer(AsyncWebsocketConsumer):
    participants={}
    transaltor_peers={}
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = None
        self.room_name=None
        self.room_id=None


    async def connect(self):
        self.user = self.scope["user"]

        if not self.user:
            return await self.close()
        
        await self.accept()

    # async def disconnect(self, code):
    #     await self.channel_layer.group_discard(
    #         self.room_id,
    #         self.channel_name
    #     )

    #     RoomConsumer.participants.get(self.room_id).remove(self.user)

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)

        message_type=data.get("type", None)


        if message_type=='create-room':
            await self.create_room(room_name=data.get('room'),
                                 code=data.get("language_code"),
                                 user_id=data.get("user_id"))
            
            
        if message_type=="join-room":
            room_id=data.get("room_id")
            peer_id=data.get("peer_id")
            await self.join_room_language(
                room_id,
                peer_id
            )

        if message_type =="send-message":
            room_id=data.get("room_id")
            await self.send_message(
                    "content",
                    room_id
            )

        if message_type=='room-created':
            room_language=data.get('room_language_id')
            print(room_language)

    async def room_created(self, event):
        room_id = event['room_language_id']
        RoomConsumer.participants[room_id]=[self.user]
        print(RoomConsumer.participants)

        await self.send(text_data=json.dumps({
            'message':'Room created',
            'room-language_id':room_id
        }))

    async def create_room(self, room_name=None, code=None, user_id=None):
        self.room_name="room_%s_%s"%(room_name, code)
        self.room_id=str(uuid.uuid4())

        # check if allowed to view

        await self.update_room_language_id(room_name, code, self.room_id)

        await self.send(text_data=json.dumps({
            "type":"room-created",
            "room_id":self.room_id,
            "room_slug":room_name
        }))

    async def join_room_language(self, room_id, peer_id):

        user = self.user

        if not RoomConsumer.participants.get(room_id):
            RoomConsumer.participants[room_id]=[]


        if user not in RoomConsumer.participants[room_id]:
            RoomConsumer.participants[room_id].append(user)

        if peer_id:
            RoomConsumer.transaltor_peers[room_id]=peer_id

        users= await self.serialize(self.participants[room_id], many=True)

        await self.send(text_data=json.dumps({
            "type":"existing-participants",
            "users":users,
            "translator_peer":RoomConsumer.transaltor_peers[room_id]
        }))

        await self.channel_layer.group_send(
            room_id,
            {
                'type': 'new_participant',
                'user':user
            }
        )

        await self.channel_layer.group_add(
                    room_id,
                    self.channel_name
                )

    async def new_participant(self, event):
        user = event["user"]
        serializer =await self.serialize(user)

        await self.send(text_data=json.dumps({
            "type":"new-participant",
            "user":serializer
        }))

    @database_sync_to_async
    def get_user_by_id(self, user_id):
        user= LinguaUser.objects.filter(id=user_id).first()
        return LinguaUserSerializer(user).data

    @database_sync_to_async
    def update_room_language_id(self, slug, code, room_language_id):
        room_language = RoomLanguage.objects.get(
            room__slug=slug,
            language_code=code
        )

        room_language.room_language_id=room_language_id
        room_language.save()

    @database_sync_to_async
    def serialize(self, user, **kwargs):
        return LinguaUserSerializer(user, **kwargs).data
    
    async def new_message(self, event):
        print(event["message"])
        await self.send(text_data=json.dumps({
            "type":"new-message",
            "message":event["message"]
        }))

    async def send_message(self, content, room_id):
        await self.channel_layer.group_send(
            room_id,
            {
                "type":"new_message",
                "message":{
                    "content":content
                }
            }
        )