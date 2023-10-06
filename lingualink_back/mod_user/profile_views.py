from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from mod_user.models import LinguaUser, ProfilePicture
from mod_user.serializers import LinguaUserSerializer, ProfilePictureSerializer, UpdateUserSerializer
from mod_user.utils import check_validation_code
from django.db.models import Q
from django.shortcuts import get_object_or_404


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def change_profile(request:Request):
    user = request.user
    serializer = ProfilePictureSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors)

    # change the previous profile picture into not current
    current_pf = ProfilePicture.objects.filter(owner=user, is_current=True).first()

    if current_pf:
        current_pf.is_current = False

        current_pf.save()

    serializer.save(owner=user)

    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_profile(request:Request):
    user = request.user
    return Response(LinguaUserSerializer(user).data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_profile(request:Request):
    user=request.user
    serializer = UpdateUserSerializer(data=request.data, instance=user)

    if not serializer.is_valid():
        return Response(serializer.errors)
    
    serializer.save()

    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request:Request):
    user:LinguaUser=request.user
    confirm_password = request.data.get('confirm_password')
    new_password = request.data.get('new_password')
    old_password = request.data.get('old_password')

    if not (confirm_password or old_password or new_password):
        return Response({'message':'Fill all the fields'})

    if new_password !=confirm_password:
        return Response({'message':'confirm password'})
    
    if not user.check_password(old_password):
        return Response({'message':"password didn't match"})
    
    user.set_password(new_password)
    user.save()

    return Response({'message':"success"})

@api_view(["GET"])
@permission_classes([IsAuthenticatedOrReadOnly])
def search_user(request:Request):
    search=str(request.query_params.get('search')).lower()
    # to exclude connected user
    exclude = request.query_params.get('exclude')
    if exclude=='true' and request.user:
        users=LinguaUser.objects.exclude(pk=request.user.id)
    users = users.filter(Q(email__icontains=search)|
                        Q(username__icontains=search)|
                        Q(first_name__icontains=search)|
                        Q(last_name__icontains=search))
    
    
    
    return Response(LinguaUserSerializer(users, many=True).data)

@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def view_profile(request:Request, pk):
    user = get_object_or_404(LinguaUser, pk=pk)
    return Response(LinguaUserSerializer(user).data)
