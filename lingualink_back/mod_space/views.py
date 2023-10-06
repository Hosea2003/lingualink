from uuid import uuid4
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.request import Request
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404, redirect
from mod_organization.models import Organization, OrganizationMember
from mod_space.models import Room, RoomLanguage, RoomInvitation, RoomMessage
from mod_space.serializers import MessageSerializer, RoomSerializer, RoomLanguageSerializer
from mod_space.utils import room_owner, load_languages, check_language_code, allow_to_view
from mod_user.models import LinguaUser
from services.gmail import send_email
from django.db.models import Q
from mod_user.serializers import LinguaUserSerializer
from mod_organization.serializers import OrganizationSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

@api_view(["GET"])
def available_languages(request:Request):
    search = request.query_params.get("search")
    languages=list(filter(lambda l:search.lower() in str(l.get("name")).lower(), load_languages()))
    return Response(languages)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_room(request: Request):
    data = request.data
    user = request.user

    serializer = RoomSerializer(data=data)

    if not serializer.is_valid():
        return Response(serializer.errors)

    room = Room.objects.create(
        host=user,
        name=data.pop("name"),
        **data
    )

    return Response(RoomSerializer(room).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@room_owner
def insert_language(request: Request,pk):
    room=get_object_or_404(Room, pk=pk)
    result=[]

    for info in request.data:
        language_code=info.get("language_code")
        translator_id = info.get("translator_id")

        language = check_language_code(language_code)
        if not language:
            continue

        translator = get_object_or_404(LinguaUser, pk=translator_id)

        #   if language_code already in room_language
        exist = RoomLanguage.objects.filter(room=room, language_code=language_code).first()

        if exist:
            continue

        room_language=RoomLanguage.objects.create(
            room=room,
            translator=translator,
            language_code=language_code
        )
        result.append(room_language)

    return Response(RoomLanguageSerializer(result, many=True).data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
@allow_to_view
def room_available_languages(request:Request, pk):
    room = get_object_or_404(Room, pk=pk)
    languages = room.languages.all()
    return Response(RoomLanguageSerializer(languages, many=True).data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def view_room(request, slug:str):
    room = get_object_or_404(Room, slug=slug)
    serializer=RoomSerializer(room)
    # return redirect("/room/view-languages/%s"%str(room.id))
    data = serializer.data
    data["languages"]=RoomLanguageSerializer(room.languages.all(), many=True).data
    return Response(data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
@room_owner
def invite_people(request, pk):

    room = get_object_or_404(Room, pk=pk)

    data = request.data
    users = data.get('users', [])
    print(users)
    organizations=data.get('organizations', [])
    user_email=[]
    user_not_found=[]
    for email in users:
        user = LinguaUser.objects.filter(email=email).first()
        if not user:
            user_not_found.append(email)
        else:
            user_email.append(email)
            RoomInvitation.objects.create(
                user=user,
                room=room
            )

    for organization_id in organizations:
        members=OrganizationMember.objects.filter(organization__id=organization_id)
        for _ in members:
            member:LinguaUser = _.user
            if member.email not in user_email:
                user_email.append(member.email)
                RoomInvitation.objects.create(
                    user=member,
                    room=room
                )


    send_email(
        "Invitation to join a conference",
        user_email,
        "We gladly invite you to join a conference. Here the code to join it: %s"%room.slug
    )

    response = {}

    if len(user_email)>0:
        response["user_with_invitation"]=user_email
    if len(user_not_found)>0:
        response["user_not_found"]=user_not_found

    return Response(response)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def join_room(request:Request):
    room_slug = request.data.get("slug")
    if not room_slug:
        return Response("Provide the rooom slug")
    
    room:Room = get_object_or_404(Room, slug=room_slug)
    type_of = room.type_of
    if type_of == Room.OPEN_TO_ALL:
        return Response({"message":"room joined", "status":"ok"})
    # check invitation or is a translator
    invitation = RoomInvitation.objects.filter(room=room, user=request.user).first()
    if not invitation:
        # check if translator
        translator = RoomLanguage.objects.filter(room=room, translator=request.user).first()
        if not translator:
            return Response({"message":"You don't have have permission to join this meeting", "status":"unvailable"})
    return Response({"message":"room joined", "status":"ok"})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search_user_organization(request:Request):
    search = request.query_params.get('search', '').lower()
    users = LinguaUser.objects.exclude(id=request.user.id).filter(Q(email__icontains=search)|
                        Q(username__icontains=search)|
                        Q(first_name__icontains=search)|
                        Q(last_name__icontains=search))
    # search organization where i am member or admin
    organization = Organization.objects.filter(name__icontains=search).filter(
        Q(members__user=request.user)|Q(admin=request.user)
    )

    return Response({
        'users':LinguaUserSerializer(users, many=True).data,
        'organizations':OrganizationSerializer(organization, many=True).data
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def created_room(request:Request):
    user = request.user
    room = Room.objects.filter(host=user)
    return Response(RoomSerializer(room, many=True).data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def join_room_language(request:Request):
    room_name= request.data.get('room_name')
    language_code = request.data.get('language_code')

    language =  RoomLanguage.objects.filter(
        room__slug = room_name,
        language_code=language_code
    ).first()

    if not language:
        return Response("Room language not available")
    
    if not language.room_language_id:
        return Response("Room did not start yet")
    
    return Response({
        "room_id":language.room_language_id
    })

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_message(request:Request, room_language_id):
    room_language=get_object_or_404(RoomLanguage, room_language_id=room_language_id)
    sender=request.user
    content = request.data.get("content")

    message = RoomMessage.objects.create(
        room_language=room_language,
        content = content,
        sender=sender
    )

    serializer = MessageSerializer(message)

    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        room_language_id,{
            "type":"new_message",
            "message":serializer.data
        }
    )

    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_message_room(request:Request, room_language_id):
    room_language=get_object_or_404(RoomLanguage, room_language_id=room_language_id)
    messages = room_language.messages.all().order_by("-id")

    return Response(MessageSerializer(messages, many=True).data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_translator(request, room_language_id):
    room_language:RoomLanguage=get_object_or_404(RoomLanguage, room_language_id=room_language_id)

    return Response(LinguaUserSerializer(room_language.translator).data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@room_owner
def update_room(request:Request, pk):
    room = get_object_or_404(Room, pk=pk)
    serializer = RoomSerializer(room, data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    serializer.save()

    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
@room_owner
def view_invited(request:Request, pk):
    room = get_object_or_404(Room, pk=pk)

    invited = [invitation.user for invitation in RoomInvitation.objects.filter(room=room)]

    return Response(LinguaUserSerializer(invited, many=True).data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@room_owner
def search_user_to_invite(request:Request, pk):
    room = get_object_or_404(Room, pk=pk)
    search=request.query_params.get('search')
    search=str(search).lower()

    users = LinguaUser.objects.filter(email__icontains=search)
    result = [
        {"user":LinguaUserSerializer(user).data, 
         "invitationSent":RoomInvitation.objects.filter(user=user, room=room).count()>0} 
         for user in users]

    return Response(result)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def start_meeting(request:Request):
    slug =request.data.get('slug')
    language_code = request.data.get("language_code")

    room_language_id=str(uuid4())

    room_language = RoomLanguage.objects.filter(
        room__slug=slug,
        language_code=language_code
    ).first()

    if not room_language:
        return Response("Room language not found", status=status.HTTP_404_NOT_FOUND)
    
    if room_language.translator != request.user:
        return Response("You are not the translator", status=status.HTTP_403_FORBIDDEN)
    
    room_language.room_language_id=room_language_id

    room_language.save()

    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.send)(
        room_language_id,{
            "type":"room-created",
            "room_language_id":room_language_id
        }
    )

    return Response({'room_language_id':room_language_id})
