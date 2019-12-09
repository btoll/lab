#!/bin/bash

#docker run --rm --name dev-nginx -p 80:80 --net="host" -v "$PWD"/nginx.conf:/etc/nginx/nginx.conf:ro  nginx:1.11.8-alpine
docker run --rm --name dev-nginx -p 80:80 -v "$PWD"/nginx.conf:/etc/nginx/nginx.conf:ro  nginx:1.11.8-alpine

