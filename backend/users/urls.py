from django.urls import path
from .views import (
    RegisterView, LoginView,
    NotificationListView, NotificationUnreadCountView,
    NotificationMarkAllReadView, NotificationMarkOneReadView,
)

urlpatterns = [
    path('notifications/', NotificationListView.as_view(), name='notifications'),
    path('notifications/unread-count/', NotificationUnreadCountView.as_view(), name='notif-unread'),
    path('notifications/mark-read/', NotificationMarkAllReadView.as_view(), name='notif-mark-all'),
    path('notifications/<int:pk>/read/', NotificationMarkOneReadView.as_view(), name='notif-mark-one'),
]
