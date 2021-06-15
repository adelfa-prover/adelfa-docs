# If the variable ADELFA is not defined, set it to the default value 'adelfa'.
# To define this variable, run 'export ADELFA=<path_to_adelfa>' in your shell

ifndef ADELFA
ADELFA = adelfa
endif

CUR_DIR = $(shell pwd)
RUBY_DIR=../../ruby-scripts

ANNOTATE_ATH=$(RUBY_DIR)/annotate_ath.rb
DETAILS_RHTML=$(RUBY_DIR)/details.rhtml
ANNOTATE_SPEC=$(RUBY_DIR)/annotate_spec.rb

ROOT_DIR:=$(dir $(realpath $(lastword $(MAKEFILE_LIST))))
SPEC_NAMES = $(notdir $(basename $(wildcard *.lf)))
SPEC_HTMLS = $(patsubst %,%_spec.html, $(SPEC_NAMES))
THMS = $(notdir $(wildcard *.ath))
THM_HTMLS = $(patsubst %.ath,%_ath.html, $(THMS))
THM_DETAIL_HTMLS = $(patsubst %.ath,%_ath_details.html, $(THMS))
HTMLFILES = $(subst index.html,, $(wildcard *.html))
SIGS = $(notdir $(wildcard *.lf))
TARBALL = examples.tar


all  : $(SPEC_HTMLS) $(THM_HTMLS) $(THM_DETAIL_HTMLS) $(CODE) \
       $(TARBALL)
	@echo "Done".

$(SPEC_HTMLS) : %_spec.html : %.lf 
	ruby -r "$(ANNOTATE_SPEC)" -e "print contents('$(ROOT_DIR)', '$*')" > $@

$(THM_HTMLS) : %_ath.html : %.ath
	ruby $(ANNOTATE_ATH) $(ROOT_DIR)$< > $@

$(THM_DETAIL_HTMLS) : %_ath_details.html : %.ath
	head -1 $< > title-line
	($(ADELFA) -a -i $*.ath) > details
	erb $(DETAILS_RHTML) > $@
	rm -f title-line details

$(TARBALL) :
	tar cvf $(TARBALL) Makefile *.lf *.ath


.PHONY : clean
clean :
	rm -f $(TARBALL) $(HTMLFILES)


