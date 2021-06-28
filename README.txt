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
  the website locally.
  Running 'make examples' will build html pages for the example
  developments.
  Running 'make tarball' will build a tar ball of the adelfa source
  directory. Set the ADELFA_SRC environment variable to the location
  of this directory if it is not in the default relative location
  of '../../systems/Adelfa'.


4. Push the Website
   These instructions are only for administrators of the web site. Do
   not use this process if you are not designated to administer the
   web page.
   
   To upload the files to the web sever, you need to do the following:

  1. Make sure the program 'rsync' is installed on your computer. It
     is used to upload files to the server.

  2. Set the environment variable 'HOST' to contain the
     username and host for running the program for uploading the files
     (i.e. rsync). For instance, if you use the cs account 'south'
     and the host 'bhoop.cs.umn.edu', then run the following command
     in your terminal:
     
       'export HOST=south@cs-pancham.cs.umn.edu

  3. Now run 'make website' to upload the necessary files to the
     website.  The default website location on the server is
     '/web/research/sparrow.cs.umn.edu/adelfa', which can be
     changed in the script 'push_website.sh' by modifying the variable
     'WEBSITE_REL_PATH'.

     Note that the current version of this script uses a two step
     process which first moves the relevant files to the remote
     location specified by 'HOST' and then moves the files from that
     location to 'WEBSITE_REL_PATH'. Duo authentication may therefore
     be required twice.
