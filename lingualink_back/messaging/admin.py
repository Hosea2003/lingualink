from django.contrib import admin
from .models import Message, ThreadMessage

admin.site.register(Message)
admin.site.register(ThreadMessage)