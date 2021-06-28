# If the variable ADELFA is not defined, set it to the default value 'adelfa'.
# To define this variable, run 'export ADELFA=<path_to_adelfa>' in your shell

ifndef ADELFA
export ADELFA = adelfa
endif

# If the variable ADELFA_SRC is not defined, set it to the default value
# of the relative path to the systems/Adelfa directory of this repository.
# To define this variable, run 'export ADELFA_SRC=<path_to_adelfa_source>'
# in your shell.
ifndef ADELFA_SRC
export ADELFA_SRC = ../../systems/Adelfa
endif

# build all the example html pages using Ruby scripts
examples:
	$(MAKE) -C examples

# build the adelfa tarball and move here
tarball:
	$(MAKE) -C $(ADELFA_SRC) tar
	mv $(ADELFA_SRC)/adelfa.tar files/adelfa.tar

all: examples tarball

.PHONY : clean
clean:
	$(MAKE) -C examples -k clean

# build all the examples pages and push the website
# This should only be run by administrators of the web page.
.PHONY : website
website: all
	./push_website.sh
