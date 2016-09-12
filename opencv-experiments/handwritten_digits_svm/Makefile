train:
	g++ -std=c++11 train.cpp `pkg-config --cflags --libs opencv` -o train

test:
	g++ -std=c++11 test.cpp `pkg-config --cflags --libs opencv` -o test
	
test_img:
	g++ -std=c++11 test_img.cpp `pkg-config --cflags --libs opencv` -o test_img	

clean:
	rm test_img