from __future__ import unicode_literals
from image_cropping import ImageRatioField
from django.db import models

class MyModel(models.Model):
    image = models.ImageField(blank=True, upload_to='uploaded_images')
    # size is "width x height"
    job_id = models.IntegerField(default=0)
    cropping = ImageRatioField('image', '400x400')
    def __str__(self):
		return "#%d Model" %(self.job_id)

class Master_scan(models.Model):
	scan_pic = models.ImageField(upload_to='temp/')
	job_id = models.IntegerField(default=0)
	pic_x = models.IntegerField(default=0)
	pic_y = models.IntegerField(default=0)
	up_date = models.DateTimeField('date uploaded')
	def __str__(self):
		return "#%d Master Scan" %(self.job_id)
# Create your models here.
