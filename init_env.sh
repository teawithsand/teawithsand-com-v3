#!/bin/bash
# Do not use yarn here, it for some reason does not add installed scripts to $PATH
cd $(realpath $(dirname "$0"))
npm i -g gatsby nodemon ts-node yalc

build_local() (
    cd $1 && yarn && yarn build
)

init_yalc () (
    cd $1 && \
    yalc add tws-common && \
    yalc add tws-gatsby-plugin && \
    yarn
)

build_local tws-common
build_local tws-gatsby-plugin

init_yalc wayside-shrine
init_yalc palm-abooks-pwa
init_yalc tws-blog
init_yalc tws-paint

build_local tws-common
build_local tws-gatsby-plugin

echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

# Test dependency list used in projects:
# jest @types/jest ts-jest jest-environment-jsdom fake-indexeddb @trust/webcrypto web-streams-polyfill @testing-library/jest-dom