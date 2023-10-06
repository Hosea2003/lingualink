from . import views
from django.urls import path

urlpatterns = [
    path('available-languages', views.available_languages),
    path('create-room', views.create_room),
    path('insert-language/<int:pk>', views.insert_language),
    path('view-languages/<int:pk>', views.room_available_languages),
    path('view-room/<str:slug>', views.view_room),
    path('invite-people/<int:pk>', views.invite_people),
    path('join-room', views.join_room),
    path('search-user-organization', views.search_user_organization),
    path('created-rooms', views.created_room),
    path("join-room-language", views.join_room_language),
    path("send-room-message/<str:room_language_id>", views.send_message),
    path('get-room-messages/<str:room_language_id>', views.get_message_room),
    path('get-translator/<str:room_language_id>', views.get_translator),
    path('update-room/<int:pk>', views.update_room),
    path('invited-users/<int:pk>', views.view_invited),
    path('search-user-to-invite/<int:pk>', views.search_user_to_invite),
    path('start-meeting', views.start_meeting)
]