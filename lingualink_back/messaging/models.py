from django.db import models
from mod_user.models import LinguaUser
from django.db.models import Count

class Message(models.Model):
    sender = models.ForeignKey(LinguaUser, on_delete=models.CASCADE, related_name='message_sent')
    receiver = models.ForeignKey(LinguaUser, on_delete=models.CASCADE, related_name='message_received')
    content = models.TextField()
    date_sent = models.DateTimeField(auto_now_add=True)

class ThreadManager(models.Manager):
    def get_or_create_personal_thread(self, user1, user2):
        threads = self.get_queryset().filter(users__in=[user1, user2]).distinct()
        threads = threads.annotate(u_count=Count('users')).filter(u_count=2)

        if threads.exists():
            return threads.first()
            
        else:
            thread=self.create()
            thread.users.add(user1)
            thread.users.add(user2)

            return thread


class ThreadMessage(models.Model):
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    # name = models.CharField(max_length=50, null=True, blank=True)

    users = models.ManyToManyField(LinguaUser)

    objects = ThreadManager()

    def __str__(self) -> str:
        return f"{self.users.first()} and {self.users.last}"