def send_notification(user, message, notif_type='general', booking_id=None):
    from .models import Notification
    Notification.objects.create(
        recipient=user,
        message=message,
        notif_type=notif_type,
        booking_id=booking_id,
    )
