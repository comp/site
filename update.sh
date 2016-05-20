#!/usr/bin/env bash
forever stop 0
git pull origin master
forever start bin/www