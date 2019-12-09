# Algorand Hackathon

## Bootstrap

### Start the Network

Create the network in the project root:

```
goal network create -n hackathon-demo -r ./demo-network -t ./template.json
```

Start the network:

```
goal network start -r ./demo-network
```

Check the status:

```
goal network status -r ./demo-network
```

You should see the following:

```
[Primary]
Last committed block: 0
Time since last block: 0.0s
Sync Time: 0.0s
Last consensus protocol: https://github.com/algorandfoundation/specs/tree/03ae4eac54f1325377d0a2df62b5ef7cc08c5e18
Next consensus protocol: https://github.com/algorandfoundation/specs/tree/03ae4eac54f1325377d0a2df62b5ef7cc08c5e18
Round for next consensus protocol: 1
Next consensus protocol supported: true
Has Synced Since Startup: false

[Kilgore]
Last committed block: 0
Time since last block: 0.0s
Sync Time: 0.0s
Last consensus protocol: https://github.com/algorandfoundation/specs/tree/03ae4eac54f1325377d0a2df62b5ef7cc08c5e18
Next consensus protocol: https://github.com/algorandfoundation/specs/tree/03ae4eac54f1325377d0a2df62b5ef7cc08c5e18
Round for next consensus protocol: 1
Next consensus protocol supported: true
Has Synced Since Startup: false

[Trout]
Last committed block: 0
Time since last block: 0.0s
Sync Time: 0.0s
Last consensus protocol: https://github.com/algorandfoundation/specs/tree/03ae4eac54f1325377d0a2df62b5ef7cc08c5e18
Next consensus protocol: https://github.com/algorandfoundation/specs/tree/03ae4eac54f1325377d0a2df62b5ef7cc08c5e18
Round for next consensus protocol: 1
Next consensus protocol supported: true
Has Synced Since Startup: false
```

### `kmd` daemon

It's necessary to start the `kmd` daemon *for each* node:

```
for node in {"Primary","Kilgore","Trout"}
do
    goal kmd start -d ./demo-network/$node
done
```

## License

[GPLv3](COPYING)

## Author

Benjamin Toll

