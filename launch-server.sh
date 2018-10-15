#!/bin/sh
# launch live-server and watchify

watchify -t brfs js/main.js -o js/bundle.js & watchify -t brfs js/result.js -o js/result-bundle.js & live-server
