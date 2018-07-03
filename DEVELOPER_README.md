# Local Development
## Prerequisite
Node.js

## Run
Then startup the website with 
```
npm install && \
npm start
```

# Deployment
## Prerequisite
Install Docker

## Build and Push to Docker Hub
```
  docker image build -t boston-scavenger . && \
  docker tag boston-scavenger benjenkinsv95/agile-connors-boston-scavenger && \
  docker push benjenkinsv95/agile-connors-boston-scavenger
```



## Run Docker Image (from Docker hub)
### Prerequisite
#### Install and []nginx proxy](https://github.com/jwilder/nginx-proxy/)
```
docker run -d -p 80:80 -v /var/run/docker.sock:/tmp/docker.sock:ro jwilder/nginx-proxy
```


### Run Image itself
```
docker pull benjenkinsv95/agile-connors-boston-scavenger && \
docker run -e VIRTUAL_HOST=boston-scavenger.ben-jenkins.com -p 80:80 benjenkinsv95/agile-connors-boston-scavenger
```

### Ports
The left port your server makes accessible. While the right port is used inside the docker container.

## HTTPS
https://medium.com/@mvuksano/using-tls-certificates-with-nginx-docker-container-74c6769a26db
