from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from mod_user.models import LinguaUser
from django.db.models import Q
from django.shortcuts import get_object_or_404

from mod_organization.models import Organization, OrganizationInvitation, OrganizationMember
from mod_user.serializers import LinguaUserSerializer
from services.gmail import send_email_with_templates
from .utils import organization_admin
from django.conf import settings

from mod_organization.serializers import OrganizationSerializer

from django.shortcuts import render
from django.template.loader import render_to_string

@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def create_organization(request:Request):
    data = request.data
    user = request.user
    serializer = OrganizationSerializer(data=data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    serializer.save(admin=user)
    
    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
@organization_admin
def invite_people(request:Request, pk):
    organization = Organization.objects.get(pk=pk)
    users = request.data.get('users')
    invitation=[]
    for user_id in users:
        user:LinguaUser = LinguaUser.objects.filter(pk=user_id).first()
        if user:
            invitation.append(user.email)
            OrganizationInvitation.objects.create(
                organization=organization,
                invited_user=user
            )

    context={
        "redirect_url":settings.SITE_URL+'/account/organisation/join-organization/'+organization.slug,
        "organization_name":organization.name
    }

    # TODO:send email
    send_email_with_templates("Invitation", invitation, 'invitation_template', context)
    return Response(OrganizationSerializer(organization).data)
    

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_organizations(request:Request):
    user=request.user
    name = request.query_params.get('name').lower()
    organizations = Organization.objects.filter(Q(admin=user)|Q(members__user=user), 
                                                name__icontains=name)
    return Response(OrganizationSerializer(organizations, many=True).data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def organization_own(request:Request):
    user = request.user
    organizations = Organization.objects.filter(admin=user)
    return Response(OrganizationSerializer(organizations, many=True).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def organization_details(request:Request, slug):
    organization = get_object_or_404(Organization, slug=slug)

    return Response(OrganizationSerializer(organization).data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def view_members(request:Request, slug):
    organization = get_object_or_404(Organization, slug=slug)
    search=request.query_params.get('search')
    members = [membership.user for membership in organization.members.filter(user__email__icontains=search)]

    return Response(LinguaUserSerializer(members, many=True).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
@organization_admin
def update_organization(request:Request, pk):
    organization = get_object_or_404(Organization, pk=pk)
    data = request.data
    serializer = OrganizationSerializer(organization, data=data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    serializer.save()
    
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search_user_to_invite(request:Request, pk):
    organization = get_object_or_404(Organization, pk=pk)
    search=str(request.query_params.get('search')).lower()

    invited = OrganizationInvitation.objects.filter(organization=organization).values_list('invited_user_id', flat=True)
    members=OrganizationMember.objects.filter(organization=organization).values_list('user_id', flat=True)

    users = LinguaUser.objects.exclude(id__in=invited).exclude(id__in=members).filter(email__icontains=search)

    return Response(LinguaUserSerializer(users, many=True).data)

def view_template(request):
    context={
        "organization_slug":'qchrOMl',
        "redirect_url":settings.SITE_URL+'/account/organisation/'+'qchrOMl'
    }
    return render(request, 'emails/invitation_template.html', context)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def join_organization(request:Request, slug):
    organization = get_object_or_404(Organization, slug=slug)

    invitation = OrganizationInvitation.objects.filter(invited_user=request.user, organization=organization).first()

    if not invitation:
        return Response("Invitation not found", status=status.HTTP_404_NOT_FOUND)
    
    OrganizationMember.objects.create(
        organization=organization,
        user=request.user
    )

    return Response("Organization joined")