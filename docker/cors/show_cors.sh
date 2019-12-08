pushd images/backend_server
docker build -t backend-server .
docker run --rm --name kilgore --net="host" -d backend-server
popd

pushd images/webserver
docker build -t webserver .
docker run --rm --name trout --net="host" -d webserver
popd

