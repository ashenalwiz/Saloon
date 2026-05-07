from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bookings', '0004_promotion_review_booking_promo'),
    ]

    operations = [
        migrations.AddField(
            model_name='booking',
            name='is_walk_in',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='promotion',
            name='min_booking_value',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
    ]
