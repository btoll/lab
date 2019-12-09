FROM nginx:latest
COPY nginx.conf /etc/nginx/nginx.conf
COPY index.html /var/www/

## docker build -t forward-proxy .
## docker run --rm --name bar --net="host" -d forward-proxy

## Don't need the following directives!
## https://github.com/nginxinc/docker-nginx/blob/master/mainline/alpine/Dockerfile
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]

