from django.urls import path
from . import views

urlpatterns=[
    path('create-organization', views.create_organization),
    path('<int:pk>/invite-people', views.invite_people),
    path("admin", views.organization_own),
    path("organizations-member", views.list_organizations),
    path('view-details/<str:slug>', views.organization_details),
    path('view-members/<str:slug>', views.view_members),
    path('update/<int:pk>', views.update_organization),
    path('search-user-to-invite/<int:pk>', views.search_user_to_invite),
    path('view', views.view_template),
    path('join-organization/<str:slug>', views.join_organization)
]