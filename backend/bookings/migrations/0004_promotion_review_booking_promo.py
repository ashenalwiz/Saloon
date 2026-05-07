import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bookings', '0003_booking_staff_member'),
        ('salons', '0003_salonstaff'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Promotion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=50)),
                ('discount_type', models.CharField(choices=[('percentage', 'Percentage'), ('fixed', 'Fixed Amount')], max_length=20)),
                ('discount_value', models.DecimalField(decimal_places=2, max_digits=10)),
                ('valid_from', models.DateField()),
                ('valid_until', models.DateField()),
                ('max_uses', models.PositiveIntegerField(default=100)),
                ('times_used', models.PositiveIntegerField(default=0)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('salon', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='promotions', to='salons.salon')),
            ],
            options={'unique_together': {('salon', 'code')}},
        ),
        migrations.AddField(
            model_name='booking',
            name='promo_code',
            field=models.ForeignKey(
                blank=True, null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='booking_set',
                to='bookings.promotion',
            ),
        ),
        migrations.AddField(
            model_name='booking',
            name='discount_amount',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.PositiveSmallIntegerField()),
                ('comment', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('booking', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='review', to='bookings.booking')),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to=settings.AUTH_USER_MODEL)),
                ('salon', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to='salons.salon')),
            ],
        ),
    ]
