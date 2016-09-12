// Standard library
#include <iostream>
#include <vector>
#include <string>
#include <fstream>
#include <stdio.h>

// OpenCV
#include <opencv2/core.hpp>
#include <opencv2/imgproc.hpp>
#include <opencv2/highgui.hpp>
#include <opencv2/ml.hpp>

// POSIX
#include <unistd.h>

using namespace std;

/**
 * main
 **/ 
int main( int argc, char** argv )
{

	//
	// Load SVM classifier 
	cv::Ptr<cv::ml::SVM> svm = cv::ml::StatModel::load<cv::ml::SVM>("classifier.yml");
    
    int numOfFiles = 5;
    string fileList[] = {"sample_img/s0.jpg","sample_img/s1.jpg","sample_img/s2.jpg","sample_img/s3.jpg","sample_img/s4.jpg"};
    int result[5];

    for ( int a = 0; a < numOfFiles; a = a + 1 )
    {
        // read image file (grayscale)
        cv::Mat imgMat = cv::imread(fileList[a], 0);
        
        // convert 2d to 1d
        cv::Mat testMat = imgMat.clone().reshape(1,1);
        testMat.convertTo(testMat, CV_32F);
        
        // try to predict which number has been drawn
        try {
            int predicted = svm->predict(testMat);
            result[a] = predicted;
            printf("%d\n", predicted);
            
//            std::cout << std::endl  << "Recognizing following number -> " << predicted << std::endl << std::endl;
//            
//            std::string notifyCmd = "notify-send -t 1000 Recognized: " + std::to_string(predicted);
//            system(notifyCmd.c_str());
            
        } catch(cv::Exception ex) {
            
        }
    }
    FILE *f;
    f = fopen("sample_img/result.txt", "w+");
    for (int i = 0; i < 5; i++) {
        fprintf(f, "%d", result[i]);
    }
    fclose(f);

}
