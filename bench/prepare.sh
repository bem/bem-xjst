#!/bin/bash

rev1=$1;
rev2=$2;

get_revision(){
    if [ ! -d "bem-xjst-$1" ]; then
        curl https://codeload.github.com/bem/bem-xjst/zip/$1 > $1.zip && unzip $1.zip && rm $1.zip
        cd bem-xjst-$1 && npm i && npm run make && cd ../
    fi
}

get_revision "$rev1"
get_revision "$rev2"
