#!/bin/bash

GREEN_FG=$(tput setaf 2)
TEAL_FG=$(tput setaf 6)
END_FG_COLOR=$(tput sgr0)

echo
echo "$GREEN_FG[$0]$END_FG_COLOR Build and run \`hackathon-app\` Docker image"
echo
docker build -t hackathon-app .
docker run --rm --name hack --net="host" -d hackathon-app

pushd app

echo
echo "$GREEN_FG[$0]$END_FG_COLOR Teardown and setup new network"
echo
goal network stop -r demo-network
goal network delete -r demo-network
rm -rf demo-network
goal network create -r demo-network -n hackathon-demo -t template.json
goal network start -r demo-network

for node in {Primary,Kilgore,Trout}
do
    echo
    echo "$GREEN_FG[$0]$END_FG_COLOR Setup node: \`$node\`"
    echo
    pushd demo-network/"$node"/kmd-v0.5
    echo
    echo "$TEAL_FG[$0]$END_FG_COLOR Enable CORS in kmd daemon config."
    echo
    mv kmd_config.json{.example,}
    sed -i 's/null/["*"]/' kmd_config.json
    popd

    echo
    echo "$TEAL_FG[$0]$END_FG_COLOR Start kmd daemon."
    echo
    goal kmd start -d "demo-network/$node"

    pushd "demo-network/$node"
    echo
    echo "$TEAL_FG[$0]$END_FG_COLOR Fiddle with permission bits."
    echo
    chmod 775 kmd-v0.5

    pushd kmd-v0.5
    chmod 644 kmd.{net,pid}
    popd

    popd
done

popd

