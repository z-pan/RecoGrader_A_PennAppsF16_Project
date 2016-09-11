# CrunchFeed

Version 1.1.0

Author: Anoxic

Last updated: Sept 4, 2015

**This file contains information that everyone new to this repo must read**

This repo is in the state of construction, so everything as sorted here will not be the same as the structures on the websites, especially those .html files. However, server files should be sorted as it is on the server.

## Legal files format ##

__The converter is currently in development__

For the sake of convenience of converting the legal files into HTML format, some of the bulky legal files need to be converted from their format to HTML every time their websites are loaded. Once the code for legal file converter is done and stable, all the update on the legal files should only happen on the change of those legal files per se.

To make the converter work, those files are in .json format, which contains a global object variable with its key representing what it is and the value to key representing the contents of the documents in .md format. If you don't know what .md format is, check https://help.github.com/articles/markdown-basics/, and use this format to edit .md either on the GitHub page (recommended) in the browser or use notepad on desktop.

This file will be placed at \Alpha\web\dev\txt\legal.json

## Directories ##

For the state of this repo right now, we are developing Alpha version, so all the files should be under Alpha folder
For all the directories mentioned above, the root folder starts at \Alpha\
* The server files should be under _\server_ directory
* All the front-end files go to _\web\dev_:
  * All the .html files are directly under this folder (i.e. \web\dev)
  * All the image files (including images and icons) go to _\web\dev\img_ with proper understandble names
  * All the css/js files that are coded by ourselves go to the corresponding folders under _\web\dev\src_
  * All the library files go to _\web\dev\lib_
* All the publish and minimized js files go to _\web\pub_
* All the text files that should be included in the websites go to _\web\dev\txt_ (create one if none exists)
* For other files, please put them in a reasonable folder

## Naming convention ##

* For all the .html, use "+" to represent a directory, use "_" to concatenate files
  * For example, recovery+init.html means this file will go to ../recovery/init on the website
* For all the files, if you have no idea what the naming convetions are, follow the convention of existing files. Those who fail to follow the convention will be ordered to change them becuase this is bad practice (and that's it).
* For all the pushes, please make understandble and reasonable names. 
  * If you are pushing after modifying/adding code, please include the version number prefixed (currently [Alpha x.x.x]). 
  * If you are not familiar with how this works, check http://semver.org/
  * If you are simply pushing texts/images, __omit__ the version number


## Issues ##

For all the issues, check the issue page, or submit one should you find any
