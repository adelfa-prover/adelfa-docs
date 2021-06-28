#!/bin/bash

WEBSITE_REL_PATH=/web/research/sparrow.cs.umn.edu/adelfa

if [ -z $HOST ] 
then
    echo -e "Please define the username and host in the environment variable 'HOST' for using the scp command\nAs an example, 'export HOST=south@cs-pancham.cs.umn.edu' set the username and host to 'south@cs-pancham.cs.umn.edu'"
else
    # rsync is used to move the web files to HOST, which may be remote or local
    rsync -arzv -p --chmod=ug+rwX,o+rX --exclude 'Makefile' --exclude 'examples/Makefile' --exclude 'examples/*/Makefile' --include='*.html' --include='*.ath' --include='*.lf' --include='*.css' --include='*.tar' --include='*/' --exclude='*' --prune-empty-dirs . $HOST:./adelfa-web-temp
    # ssh is used to move the previously copied to HOST to the appripriuate web directory.
    # this structure permits us to ensure that the user is changed to the cs-teyjus group
    # prior to attempting to move the files.
    ssh $HOST /bin/bash <<-EOF
cd adelfa-web-temp
newgrp cs-teyjus
cp -r -u * ${WEBSITE_REL_PATH}/
cd ../
rm -rf adelfa-web-temp
EOF
fi
