from django.contrib import admin

from mod_user.models import AuthorizationCode, LinguaUser, ProfilePicture

admin.site.register(LinguaUser)
admin.site.register(ProfilePicture)
admin.site.register(AuthorizationCode)