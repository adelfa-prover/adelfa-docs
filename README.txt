This directory contains the files for generating the website for
Adelfa. Follow the steps below to generate the website:

1. Compile the Adelfa theorem prover

   You can find it at:
   
      files/adelfa.tar


2. Set the environment variables for running Adelfa

  To run the makefiles for generating the website, we need to setup
  environment variables containing the paths to the Adelfa executable.
  In your terminal, run the following commands:

     'export ADELFA=<path_to_the_executable_for_Adelfa>'

3. Run the makefile
  
  In the root directory, run 'make' will generate all the files for
  the website locally. To upload these files to the web sever, you
  need to do the following:

  1. Make sure the program 'rsync' is installed on your computer. It
     is used to upload files to the server.

  2. Set the environment variable 'WEBSITE_URL' to contain the
     username and host for running the program for uploading the files
     (i.e. rsync). For instance, if you use the cs account 'south'
     and the host 'bhoop.cs.umn.edu', then run the following command
     in your terminal:
     
       'export WEBSITE_URL=south@cs-pancham.cs.umn.edu

  3. Now run 'make website' to upload the necessary files to the
     website.  The default website location on the server is
     '/web/research/sparrow.cs.umn.edu/adelfa', which can be
     changed in the script 'push_website.sh' by modifying the variable
     'WEBSITE_REL_PATH'.

