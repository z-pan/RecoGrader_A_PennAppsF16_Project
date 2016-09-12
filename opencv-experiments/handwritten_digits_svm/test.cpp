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

// hold labels -> test filenames
std::vector<int> expectedLabels;
std::vector<std::string> testFilenames;

/**
 * Gets test files and store labels/filenames in vector classes
 **/
void getsTestFiles()
{
	
	// open directory containing number directories
	tinydir_dir test_root_dir;
	tinydir_open(&test_root_dir, "test_files");

	// iterate over directories
	while (test_root_dir.has_next)
	{
		// get file
		tinydir_file file;
    	tinydir_readfile(&test_root_dir, &file);

		// if it is a directory		
		if(file.is_dir){

			std::string numbersDirName = file.name;
			
			// skip . / .. / .DS_Store (OSX)
			if(numbersDirName != "." && numbersDirName != ".." && numbersDirName != ".DS_Store"){
			
				// atoi isn't supersafe but sufficient for this test
				int currentLabel = atoi(file.name);

				// prepend full test_files directory
				numbersDirName.insert(0, "test_files/");
				
				// open directory containing number directories
				tinydir_dir test_number_dir;
				tinydir_open(&test_number_dir, numbersDirName.c_str() );

				// iterate over directories
				while (test_number_dir.has_next)
				{
					// get file
					tinydir_file testJpgFile;
    				tinydir_readfile(&test_number_dir, &testJpgFile);

					// get directory name
					std::string testJpgFileName = testJpgFile.name;

					// skip . / .. / .DS_Store (OSX)
					if (testJpgFileName != "." && testJpgFileName != ".." && testJpgFileName != ".DS_Store"){
						
						// prepend full test_files directory
						testJpgFileName.insert(0, numbersDirName + "/");
						
						// store test filename and expected label
						testFilenames.push_back(testJpgFileName);		
						expectedLabels.push_back(currentLabel);	
					}
					
					// get next file
					tinydir_next(&test_number_dir);
				}

				// close directory	
				tinydir_close(&test_number_dir); 	
			}
		}

		// get next file
		tinydir_next(&test_root_dir);
	}

	// close directory	
	tinydir_close(&test_root_dir);	
} 

/**
 * main
 **/ 
int main( int argc, char** argv )
{
	//
	// get test files
	getsTestFiles();	

	//
	// Load SVM classifier 
	cv::Ptr<cv::ml::SVM> svm = cv::ml::StatModel::load<cv::ml::SVM>("classifier.yml");

	// stats information
	int totalClassifications = 0;
	int totalCorrect = 0;
	int totalWrong = 0;

	// loop over test filenames
	for(int index=0; index<testFilenames.size(); index++) 
    {
		// read image file (grayscale)
		cv::Mat imgMat = cv::imread(testFilenames[index], 0);
	
		// convert 2d to 1d	
		cv::Mat testMat = imgMat.clone().reshape(1,1);
		testMat.convertTo(testMat, CV_32F);

		// try to predict which number has been drawn
		try{
			int predicted = svm->predict(testMat);
			//std::cout<< "expected: " << expectedLabels[index] << " -> predicted: " << predicted << std::endl;
			
			// stats
			totalClassifications++;
			if(expectedLabels[index] == predicted) { totalCorrect++; } else { totalWrong++; }
			
		}catch(cv::Exception ex){
			
		}	

	}	
	
	// calculate percentages
	float percentageCorrect = ((float)totalCorrect / totalClassifications) * 100;
	float percentageIncorrect =  100 - percentageCorrect;

	// output 
	std::cout << std::endl << "Number of classications : " << totalClassifications << std::endl;
	std::cout << "Correct:  " << totalCorrect << " (" << percentageCorrect << "%)" << std::endl;
	std::cout << "Wrong: " << totalWrong  << " (" << percentageIncorrect << "%)" << std::endl;


}