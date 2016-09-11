from django.contrib import admin
from .models import Master_scan, MyModel
from image_cropping import ImageCroppingMixin

class MyModelAdmin(ImageCroppingMixin, admin.ModelAdmin):
    pass

admin.site.register(MyModel, MyModelAdmin)
admin.site.register(Master_scan)
# Register your models here.
