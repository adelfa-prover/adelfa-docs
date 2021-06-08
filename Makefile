# If the variable ADELFA is not defined, set it to the default value 'adelfa'.
# To define this variable, run 'export ADELFA=<path_to_adelfa>' in your shell

ifndef ADELFA
export ADELFA = adelfa
endif


all:
	$(MAKE) -C examples

.PHONY : clean
clean:
	$(MAKE) -C examples -k clean

.PHONY : website
website: all
	./push_website.sh
