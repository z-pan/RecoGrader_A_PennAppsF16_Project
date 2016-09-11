# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-09-11 01:33
from __future__ import unicode_literals

from django.db import migrations, models
import image_cropping.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Master_scan',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('scan_pic', models.ImageField(upload_to='temp/')),
                ('job_id', models.IntegerField(default=0)),
                ('pic_x', models.IntegerField(default=0)),
                ('pic_y', models.IntegerField(default=0)),
                ('up_date', models.DateTimeField(verbose_name='date uploaded')),
            ],
        ),
        migrations.CreateModel(
            name='MyModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(blank=True, upload_to='uploaded_images')),
                ('job_id', models.IntegerField(default=0)),
                ('cropping', image_cropping.fields.ImageRatioField('image', '400x400', adapt_rotation=False, allow_fullsize=False, free_crop=False, help_text=None, hide_image_field=False, size_warning=False, verbose_name='cropping')),
            ],
        ),
    ]