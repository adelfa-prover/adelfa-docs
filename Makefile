# If the variable ADELFA is not defined, set it to the default value 'adelfa'.
# To define this variable, run 'export ADELFA=<path_to_adelfa>' in your shell

ifndef ADELFA
export ADELFA = adelfa
endif

# build all the example html pages using Ruby scripts
all:
	$(MAKE) -C examples

.PHONY : clean
clean:
	$(MAKE) -C examples -k clean

# build all the examples pages and push the website
.PHONY : website
website: all
	./push_website.sh
