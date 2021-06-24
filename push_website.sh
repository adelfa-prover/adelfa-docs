#!/bin/bash

WEBSITE_REL_PATH=/web/research/sparrow.cs.umn.edu/adelfa

if [ -z $WEBSITE_URL ] 
then
    echo -e "Please define an url in the environment variable 'WEBSITE_URL' for using the scp command\nAs an example, 'export WEBSITE_URL=south@cs-pancham.cs.umn.edu' set the url to 'south@cs-pancham.cs.umn.edu'"
else
    rsync -arzv -p --chmod=ug+rwX,o+rX --exclude 'Makefile' --exclude 'examples/Makefile' --exclude 'examples/*/Makefile' --include='*.html' --include='*.ath' --include='*.lf' --include='*.css' --include='*.tar' --include='*/' --exclude='*' --prune-empty-dirs . $WEBSITE_URL:./adelfa-web-temp
    ssh $WEBSITE_URL /bin/bash <<-EOF
cd adelfa-web-temp
newgrp cs-teyjus
cp -r -u * ${WEBSITE_REL_PATH}/
cd ../
rm -rf adelfa-web-temp
EOF
fi
