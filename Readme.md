
# Docker
```bash
# docker network
docker network create mynetwork
docker network ls


# docker mongo to network
docker run --network mynetwork --name some-mongo -p 27017:27017 -d mongo:6.0.3


# docker build and network
docker build -t node-docker .
docker run  -d \
  -e apiCWBKey=CWB-00000000-0000-0000-0000-000000000000 \
  -e mongoDBConnectString=mongodb://some-mongo:27017/cloud_demo \
  --network mynetwork \
  -p 3000:3000 \
  --name some-node-docker \
  node-docker
```