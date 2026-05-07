from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('salons', '0004_favouritesalon'),
        ('services', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='salonstaff',
            name='working_days',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name='salonstaff',
            name='specialties',
            field=models.ManyToManyField(blank=True, related_name='staff_specialties', to='services.service'),
        ),
    ]
