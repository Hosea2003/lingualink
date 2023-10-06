from django.contrib import admin

from mod_organization.models import Organization, OrganizationInvitation, OrganizationMember

# Register your models here.
admin.site.register(Organization)
admin.site.register(OrganizationInvitation)
admin.site.register(OrganizationMember)