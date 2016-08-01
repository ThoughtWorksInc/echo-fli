#!/usr/bin/env bash

src=$1
dest=$2

rm -rf $dest $dest.zip \
&& mkdir $dest \
&& cp $src/* $dest \
&& cd $dest \
&& npm install --production \
&& zip -r ../$dest.zip *
