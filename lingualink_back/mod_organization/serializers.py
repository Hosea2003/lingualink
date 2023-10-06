from rest_framework import serializers

from mod_organization.models import Organization, OrganizationMember
from mod_user.serializers import LinguaUserSerializer

class OrganizationSerializer(serializers.ModelSerializer):
    admin = LinguaUserSerializer(read_only=True)
    members=serializers.SerializerMethodField()
    slug = serializers.CharField(read_only=True)
    class Meta:
        model = Organization
        fields = '__all__'

    def get_members(self, obj):
        members = OrganizationMember.objects.filter(organization=obj)
        return members.count()