from django.db import models

from mod_user.models import LinguaUser
import string
import random
from django.utils import timezone


class Room(models.Model):
    host = models.ForeignKey(LinguaUser, on_delete=models.CASCADE)
    slug = models.CharField(unique=True, max_length=7)
    name = models.CharField(max_length=50)
    scheduled = models.DateTimeField(default=timezone.now)
    description = models.TextField()

    OPEN_TO_ALL="OTA"
    INVITED_ONLY="IO"

    TYPE_OF=[
        ("OTA", "Open To All"),
        ("IO", "Invite Only")
    ]

    type_of = models.CharField(
        max_length=3,
        choices=TYPE_OF,
        default="OTA"
    )

    def save(self, *args, **kwargs):
        if not self.pk:
            #             generate unique slug
            letters = string.ascii_letters
            self.slug = ''.join(random.choice(letters) for i in range(7))
        super().save(*args, **kwargs)

    def __str__(self):
        return self.slug + " " + self.name


class RoomLanguage(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="languages")
    language_code = models.CharField(max_length=20)
    translator = models.ForeignKey(LinguaUser, on_delete=models.SET_NULL, null=True, blank=True)
    room_language_id = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return "%s-%s" % (self.room.slug, self.language_code)

class RoomInvitation(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="invitations")
    user = models.ForeignKey(LinguaUser, on_delete=models.CASCADE)
    invited_on = models.DateTimeField(default=timezone.now)

class RoomMessage(models.Model):
    room_language = models.ForeignKey(RoomLanguage, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(LinguaUser, on_delete=models.CASCADE)
    content = models.TextField()