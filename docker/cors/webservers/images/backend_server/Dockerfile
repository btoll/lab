FROM nginx:latest
COPY nginx.conf /etc/nginx/nginx.conf
COPY app.json /var/www/api/

## docker build -t backend-server .
## docker run --rm --name bar --net="host" -d backend-server

## Don't need the following directives!
## https://github.com/nginxinc/docker-nginx/blob/master/mainline/alpine/Dockerfile
EXPOSE 9001
#CMD ["nginx", "-g", "daemon off;"]

