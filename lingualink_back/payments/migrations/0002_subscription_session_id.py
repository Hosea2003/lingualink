# Generated by Django 4.2 on 2023-08-01 08:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='subscription',
            name='session_id',
            field=models.CharField(default='', max_length=250),
            preserve_default=False,
        ),
    ]
