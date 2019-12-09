FROM nginx:latest
COPY nginx.conf /etc/nginx/nginx.conf

## docker build -t reverse-proxy .
## docker run --rm --name foo --net="host" -d reverse-proxy
## docker run --rm --name dev-nginx -p 80:80 -v "$PWD"/nginx.conf:/etc/nginx/nginx.conf:ro nginx:1.11.8-alpine

## Don't need the following directives!
## https://github.com/nginxinc/docker-nginx/blob/master/mainline/alpine/Dockerfile
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]

