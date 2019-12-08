pushd images/frontend_server
docker build -t frontend-server .
docker run --rm --name foo --net="host" -d frontend-server
popd

pushd images/backend_server
docker build -t backend-server .
docker run --rm --name bar --net="host" -d backend-server
popd

pushd images/reverse_proxy
docker build -t reverse-proxy .
docker run --rm --name quux --net="host" -d reverse-proxy
popd

