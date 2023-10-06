from rest_framework.decorators import api_view, permission_classes

from mod_user.models import LinguaUser
from mod_user.serializers import LinguaUserSerializer
from .models import Message, ThreadMessage
from .serializers import MessageSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.request import Request
from django.shortcuts import get_object_or_404
from django.db.models import Q


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request:Request):
    receiver_id=request.data.get('receiver_id')
    receiver = get_object_or_404(LinguaUser, id=receiver_id)
    content = request.data.get('content')

    message = Message.objects.create(
        receiver=receiver,
        sender=request.user,
        content = content
    )

    serializer = MessageSerializer(message)

    thread = ThreadMessage.objects.get_or_create_personal_thread(
        receiver, request.user
    )



    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_interacted(request:Request):
    user = request.user
    search = request.query_params.get('search')

    if search or len(search)>0:
        users = LinguaUser.objects.exclude(id=user.id).filter(
            Q(email__icontains=search)|
            Q(username__icontains=search)|
            Q(first_name__icontains=search)|
            Q(last_name__icontains=search)
        )

        return Response(LinguaUserSerializer(users, many=True).data)


    messages = Message.objects.filter(
        Q(receiver=user)|
        Q(sender=user)
    ).order_by('-id')

    users=[]

    for message in messages:
        if(message.receiver==user):
            if(message.sender not in users):
                users.append(message.sender)
        else:
            if(message.receiver not in users):
                users.append(message.receiver)

    return Response(LinguaUserSerializer(users, many=True).data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_messages(request:Request, pk):
    user =request.user
    other =get_object_or_404(LinguaUser, pk=pk)

    messages = Message.objects.filter(
        Q(receiver=user, sender=other)|
        Q(sender=user, receiver=other)
    ).order_by('-id')

    return Response(MessageSerializer(messages, many=True).data)