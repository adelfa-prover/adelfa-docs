Ruby scripts for generating html files 


annotate_spec.rb
----------------
This script produces an annotated html file from an LF
specification. It defines two functions. read_lf takes a single
argument of the full path to the file to be ready and collects the
complete signature into html content which is returned. contents takes
two arguments, the file name of the specification to be annotated and
the path to the location of that specification file, and wraps the
contents of the specification with html code to create a complete
page.


annotate_ath.rb
---------------
This script produces an annotated html file from an Adelfa theorem
file. It takes a single argument which is the path+filename for the
Adelfa theorem file to be annotated.


details.rhtml
-------------
This file contains a template html structure for the detailed view of
a proof development to display Adelfa proof states for each command of
an Adelfa theorem file.

