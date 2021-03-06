# Setup
The installation has been well tested to work on Ubuntu 16.04. Issues have been reported with installation on windows.
* Install latest version of docker in your system.
* Clone this project; actually you only require the `docker-stack.yml` file and the other two `*.env` files : )
* Change the env variables in `worker.env` and `server.env` as per your required variables. Note the frontend service will start on port `80` only due to image.
* Run the command in terminal `docker swarm init` to initialize a docker swarm.
* Now you can connect multiple nodes to this swarm using the key generated by running above command.
* Execute `docker stack deploy -c docker-stack.yml cp` and as easy as that.
* All the services will be up and running in a few minutes (depending upon your internet connectivity).
* You can check for running service by command `docker service ls`
* Any of these four running services can easily be scaled by writing `docker service scale cp_<serive_name>=<number_of_replicas_required>`

# Services
  * The app has mainly five services running independently which can be scaled individually as per requirement.
  * Frontend - The frontend is made using ReactJS uses API endpoints developed in App server.
  * Server(Backend) - Backed or API server is based on NodeJS. We are using MongoDB for database.
  * Worker - It's main task is to keep an eye on the queue to keep updating the click tracks.
  * Redis server - This server is responsible to maintain LRU cache for hash:url pairs and a queue that is used to 
  * MongoDB - MongoDB service whhich can easily be scaled by clustering multiple instances. 
  track clicks on a hash link