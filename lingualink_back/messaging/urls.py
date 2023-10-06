from django.urls import path
from . import views

urlpatterns=[
    path('get-users', views.user_interacted),
    path('get-messages/<int:pk>', views.get_messages)
]