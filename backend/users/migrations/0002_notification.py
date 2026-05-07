import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField()),
                ('notif_type', models.CharField(
                    choices=[
                        ('booking_confirmed', 'Booking Confirmed'),
                        ('booking_awaiting', 'Awaiting Client Action'),
                        ('booking_cancelled', 'Booking Cancelled'),
                        ('general', 'General'),
                    ],
                    default='general', max_length=30,
                )),
                ('is_read', models.BooleanField(default=False)),
                ('booking_id', models.PositiveIntegerField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('recipient', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='notifications',
                    to=settings.AUTH_USER_MODEL,
                )),
            ],
            options={'ordering': ['-created_at']},
        ),
    ]
