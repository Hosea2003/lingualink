# Generated by Django 4.2 on 2023-08-07 06:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mod_user', '0008_authorizationcode'),
    ]

    operations = [
        migrations.AlterField(
            model_name='authorizationcode',
            name='code',
            field=models.CharField(max_length=250, unique=True),
        ),
    ]