// Standard library
#include <iostream>
#include <vector>
#include <string>

// OpenCV
#include <opencv2/core.hpp>
#include <opencv2/imgproc.hpp>
#include <opencv2/highgui.hpp>
#include <opencv2/ml.hpp>

// TinyDir
#include "tinydir.h"

// hold labels -> training filenames
std::vector<int> labels;
std::vector<std::string> trainingFilenames;
 
/**
 * Gets training files and store labels/filenames in vector classes
 **/
void getsTrainingFiles()
{
	
	// open directory containing number directories
	tinydir_dir training_root_dir;
	tinydir_open(&training_root_dir, "training_files");

	// iterate over directories
	while (training_root_dir.has_next)
	{
		// get file
		tinydir_file file;
    	tinydir_readfile(&training_root_dir, &file);

		// if it is a directory		
		if(file.is_dir){

			std::string numbersDirName = file.name;
			
			// skip . / .. / .DS_Store (OSX)
			if(numbersDirName != "." && numbersDirName != ".." && numbersDirName != ".DS_Store"){
			
				// atoi isn't supersafe but sufficient for this test
				int currentLabel = atoi(file.name);

				// prepend full training_files directory
				numbersDirName.insert(0, "training_files/");
				
				// open directory containing number directories
				tinydir_dir training_number_dir;
				tinydir_open(&training_number_dir, numbersDirName.c_str() );

				// iterate over directories
				while (training_number_dir.has_next)
				{
					// get file
					tinydir_file trainingJpgFile;
    				tinydir_readfile(&training_number_dir, &trainingJpgFile);

					// get directory name
					std::string trainingJpgFileName = trainingJpgFile.name;

					// skip . / .. / .DS_Store (OSX)
					if (trainingJpgFileName != "." && trainingJpgFileName != ".." && trainingJpgFileName != ".DS_Store"){
						
						// prepend full training_files directory
						trainingJpgFileName.insert(0, numbersDirName + "/");
						
						// store training filename and label
						trainingFilenames.push_back(trainingJpgFileName);		
						labels.push_back(currentLabel);	
					}
					
					// get next file
					tinydir_next(&training_number_dir);
				}

				// close directory	
				tinydir_close(&training_number_dir); 	
			}
		}

		// get next file
		tinydir_next(&training_root_dir);
	}

	// close directory	
	tinydir_close(&training_root_dir);	
}

/**
 * main
 **/
int main( int argc, char** argv )
{
	// get training files
	getsTrainingFiles();
	
	// image dimensions
	int imgArea = 28 * 28;
	
	//
	// process images
	
	// will hold training data
	cv::Mat trainingMat(trainingFilenames.size(), imgArea, CV_32FC1);

	// loop over training files
	for(int index=0; index<trainingFilenames.size(); index++) 
    {
		// output on which file we are training 
		std::cout << "Analyzing label -> file: " <<  labels[index] << "|" <<  trainingFilenames[index] << std::endl;

		// read image file (grayscale)
		cv::Mat imgMat = cv::imread(trainingFilenames[index], 0);
		
		int ii = 0; // Current column in training_mat
		
		// process individual pixels and add to our training material
		for (int i = 0; i<imgMat.rows; i++) {
 		   for (int j = 0; j < imgMat.cols; j++) {
        		trainingMat.at<float>(index, ii++) = imgMat.at<uchar>(i,j);
    		}
		}
	}
	
	//
	// process labels
	
	int labelsArray[labels.size()];
	
	// loop over labels
	for(int index=0; index<labels.size(); index++) 
    	{
		labelsArray[index] = labels[index];
	}	
	
	cv::Mat labelsMat(labels.size(), 1, CV_32S, labelsArray);

	//
	// train SVM 
	
    // Set up SVM's parameters
	cv::Ptr<cv::ml::SVM> svm = cv::ml::SVM::create();
	svm->setType(cv::ml::SVM::C_SVC);
	svm->setKernel(cv::ml::SVM::POLY);
    svm->setTermCriteria(cv::TermCriteria(cv::TermCriteria::MAX_ITER, 100, 1e-6));
	svm->setGamma(3); 
	svm->setDegree(3);

	// train svm classifier	 
	std::cout << "Start training SVM classifier" << std::endl;
    svm->train( trainingMat , cv::ml::ROW_SAMPLE , labelsMat );

	// store trained classifier
	std::cout << "Saving SVM data" << std::endl;	
	svm->save("classifier.yml");

}
