# Generated by Django 4.2 on 2023-07-23 20:18

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('mod_organization', '0002_organizationinvitation'),
    ]

    operations = [
        migrations.AddField(
            model_name='organization',
            name='created_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name='organization',
            name='slug',
            field=models.CharField(default='ABCDEFG', max_length=7),
            preserve_default=False,
        ),
    ]