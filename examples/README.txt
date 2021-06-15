This directory stores the source and generated html files for examples
to be displayed on the Adelfa site.


To add a new example to this collection:

1. place the relevant .lf signature file and the .ath theorem file for
   the example into the approrpiate example subdirectory.

2. Add the example to the list in index.html under an appropriate
   heading with a link to the file
   '<subdirectory name>/<theorem file name>_ath.html`
   which will be generated in the next step

3. Run make to generate the html files for the new example(s) locally,
   and check that they are correct.

To push an updated example set follow the instructions in the README
contained in the parent directory.


