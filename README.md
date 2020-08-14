# TinyURL
Oftenly we may face situations where handling big links become a difficult task, you might end up destroying the complete link by just missing this one char. So we require a system that can form aliases for our links and we we can use this new small and crisp link instead of bulky links.

# Objectives
## Primary Objectives
* The system should create very small links for any web link given to it.
* When generated link is hit to website, it should redirect it to desired link.
* Generated links can be made private only for a given user.
* Links must expire after some time like 5 years or so

## Secondary Objectives
* System should be highly available and scalable else, there will be a lot of request miss.
* Redirections should occur in minimal time.
* Number of redirections done should also be tracked.
* Service can be used through API endpoints.

# Estimations
Well our system will be a read intensive one, as number of redirections will be much more than new aliases that are created, Let the ratio of read to write be 100:1. 
## Traffic Estimate
* URL Shortenings -
  * Lets assume that we get ~200 shortenings/second
* Redirections -
  * Lets assume that we get ~20K redirections/second
## Storage Estimate
* Since we are getting 200 shortenings/sec and we will keep a link alias only for 5 years.
* Storage required (assuming each request is 500bytes), will count upto 15 TB
## Bandwidth Estimate
* We are receiving 20K read request/sec, so assuming each request takes upto 500bytes, approx bandwidth will be 10MB/sec
## Memory Estimate
* It is well known that 20% of website form 80% of traffic. So we can cache these 20% of website in main memory, so that, such requests are served very quickly for these websites.
* Since we get 20K requests/sec, we can predict memory for cache to be approx 200GB. (memory size upto 256 GB are available)

# APIs
* /api/signup - {name, username, password}; to register a user
* /api/signin - {username, password}; to login a user
* /api/tinyurl/create - {url} {Authorization header with token}; create new tinyurl
* /api/tinyurl/:tinyhash - {Authorization token if availbale}; get original link. In case the user is not authorized, access will be denied.

# Database
There will be two tables-
* User table to store name, username, password in encrypted form.
* Url table to store hash and their corresponding original URLs with user_id of the creator.

# Algorithm
The core logic is to create unique hash for each link. Following is the method we are using
* append the link with user_id of creator and use MD5 to hash it.
* Take first 8 chars and any random character from remaining hash (here we are taking 20th character).
* This will ensure that even if two users enter same URL, different hash will be generated, but for each user same hash will always be generated for same link.

# Scaling Up Database
Here we will be using MongoDB, which is a NoSQL database, and it's very easy to scale this Database, Also internal sharding is done automatically by the cluster of MongoDB. Further reading can be observed [here]([https://docs.mongodb.com/manual/sharding/](https://docs.mongodb.com/manual/sharding/)).

# Cache
* As discussed above we will be storing 20% of links hash and there corresponding links in cache. Here we will be using Redis to save our hash link pairs in cache. Redis can also be easily scaled and lots of painful task is also taken care of. 
* We will be using LRU (Least Recently used Algorithm) to maintain our cache. Under this policy we discard least recently used first. Which is best suited for our objective.

# ClickTracking
Here as soon as a tinyurl is hit, upon retrieving it from cache or DB, a task is put to queue, that is processed further by a worker, that can increment the count of that tinyurl by 1, This is done to reduce the response time as database update may take time and will bring latency to redirections, which is not at all admirable.

# Load Balancing
Load balancers can be put in following places.
* Between Clients and Application servers
* Between Application Servers and database servers
* Between Application Servers and Cache servers
# DB cleanup
We can write a cron job or a script that can run periodically that deletes all the entries from the database that are older than five years. This will ensure that our Storage remains in 15 TB as per our estimation above for five years. Ideally this cron Job must be run at times when traffic is low. To reduce unwanted load on server.
# Orchestration
Here we are using containers to deploy our application, this makes our deployment very easy, also we are using docker swarm for orchestration of these containers, so we we can easily scale out system by creating multiple instances of a service. The internal load balancing etc is automatically taken care by docker swarm.

# System Work Flow
![Flow Diagram Image](https://saurass.github.io/assets/images/nbproj.jpg)
# Links to other parts of the project
* [TinyURL Frontend on ReactJS](https://github.com/saurass/tinyurl_frontend)
* [TinyURL NodeJS Backend server](https://github.com/saurass/tinyurl_server)
* [TinyURL ClickTrack Worker](https://github.com/saurass/tinyurl_clicktrack)
# Contribution
Please feel free to make contributions and raise issues. thank You : )