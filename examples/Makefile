# If the variable ADELFA is not defined, set it to the default value 'adelfa'.
# To define this variable, run 'export ADELFA=<path_to_adelfa>' in your shell

ifndef ADELFA
ADELFA = adelfa
endif

all :
	$(MAKE) -C FirstOrder
	$(MAKE) -C LambdaCalculi
	$(MAKE) -C Logic
	$(MAKE) -C ProgLang

.PHONY : clean
clean :
	$(MAKE) -C FirstOrder -k clean
	$(MAKE) -C LambdaCalculi -k clean
	$(MAKE) -C Logic -k clean
	$(MAKE) -C ProgLang -k clean


