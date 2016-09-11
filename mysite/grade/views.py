from django.shortcuts import get_object_or_404, render
from django.http import Http404
from django.http import HttpResponse
from models import MyModel, Master_scan
from django.template import loader
from django.views import generic
from subprocess import call
import os.path
import string
import sys
from django.shortcuts import render_to_response

# class IndexView(generic.ListView):
# 	#os.mkdir("newdir")
# 	template_name = 'grade/index.html'
# 	context_object_name = 'job_list'

# 	def get_queryset(self):
# 		return MyModel.objects.order_by('-job_id')[:5]

def index(request):
	job_list = MyModel.objects.order_by('-job_id')[:5]
	work_list = Master_scan.objects.all
	template = loader.get_template('grade/index.html')
	context = {
		'job_list': job_list,
		'work_list': work_list
	}
	return HttpResponse(template.render(context, request))

# class DetailView(generic.DetailView):
# 	model = MyModel
# 	template_name = 'grade/detail.html'

# 	def get_object(self):
# 		return get_object_or_404(MyModel, pk = request.session['job_id'])

# def detail(request, job_id):
# 	try:
# 		job = MyModel.objects.get(pk = job_id)
# 	except MyModel.DoesNotExist:
# 		raise Http404("Question does not exist")
# 	return render(request, 'grade/detail.html', {'job':job})
def detail(request, job_id):
	job_list = MyModel.objects.order_by('-job_id')[:5]
	template = loader.get_template('grade/detail.html')
	context = {
		'job_list': job_list,
		'jobid': job_id
	}
	return HttpResponse(template.render(context, request))

def result(request, job_id):
    f = open('1.txt','r')
    x = f.readlines()
    y = x[1:3] + x[5:7]
    f.close()
    if (os.path.isfile("1.txt")):
        os.remove("1.txt")
    all=string.maketrans('','')
    nodigs=all.translate(all, string.digits)
    for i in range(0,4):
        y[i] = y[i].translate(all, nodigs)
    
    
    work_list = Master_scan.objects.all()
    for item in Master_scan.objects.all():
        y.append("http://127.0.0.1:8000/media/"+str(item.scan_pic))
    template = loader.get_template('grade/result.html')
    context = {
    'work_list': work_list
    }
    x1 = int(y[0])
    y1 = int(y[1])
    w = int(y[2])
    h = int(y[3])
        
    pic1 = y[4]
    pic2 = y[5]
        
    for j in range(0, 5):
        outputString = "/Users/zpan/GitHub/opencv-experiments/handwritten_digits_svm/sample_img/s%d.jpg"%(j)
        call(["convert", "%s"%(y[4+j]), "-crop", "%dx%d+%d+%d"%(w,w,x1,y1), "midres.jpg"])
        call(["convert", "midres.jpg", "-resize", "28x28", "resized.jpg"])
        call(["convert", "-negate", "resized.jpg", "%s"%(outputString)])
    ##os.system("/Users/zpan/GitHub/opencv-experiments/handwritten_digits_svm/./test_img")
    return HttpResponse(template.render(context, request))