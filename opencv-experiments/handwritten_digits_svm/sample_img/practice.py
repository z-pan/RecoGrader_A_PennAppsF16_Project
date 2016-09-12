import sys
a = sys.argv[1]
b = sys.argv[2]
c = sys.argv[3]
d = sys.argv[4]

from subprocess import call
call(["convert", "srcfew.png", "-crop", "%sx%s+%s+%s"%(a,b,c,d), "midres.png"])
call(["convert", "midres.png", "-resize", "28x28", "resized.png"])
call(["convert", "-negate", "resized.png", "s0.png"])
# call("pwd")
# call(["cd", "CMU"])
# call("pwd")
# import os
# os.system("pwd")
# os.system("cd CMU")
# os.system("pwd")
# call(["cd", "CMU"])
# call("ls")
# call(["ls", "-l"])