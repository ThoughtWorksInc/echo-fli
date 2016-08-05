#!/usr/bin/env bash

src=$1
dest=$2

rm -rf $dest $dest.zip \
&& mkdir $dest \
&& rsync -rv --exclude=node_modules $src/* $dest \
&& cp package.json $dest \
&& cd $dest \
&& npm install --production \
&& zip -r ../$dest.zip *
