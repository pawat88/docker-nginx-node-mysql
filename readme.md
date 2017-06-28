How to setup docker nginx, nodejs and mysql

- Create docker network 

docker network create nodetest-network


- Create docker mariadb test database server

docker run --network=nodetest-network --name db -d -e MYSQL_ROOT_PASSWORD=123 -e MYSQL_DATABASE=users -e MYSQL_USER=users_service -e MYSQL_PASSWORD=123 -p 3306:3306 mysql:latest

- Import data into database

cd test-database && docker exec -i db mysql -uusers_service -p123 users < setup.sql

- Build and run user service

docker build -t users-service . 

docker run -d --network=nodetest-network --name user-service -p 8123:8123 users-service

- Test by open browser 

<ip>:8123/users

- Deploy Nginx 

docker run -d --network=nodetest-network -p 80:80 --name node-nginx nginx

docker cp nodetest.conf node-nginx:/etc/nginx/conf.d/nodetest.conf

docker exec -it node-nginx bash

nginx -t 

nginx -s reload

- Set host to 
<ip> testnode testnode.com

- Access to testnode.com from browser again

# the nginx server instance
server {
    listen 0.0.0.0:80;
    server_name testnode testnode.com;
    access_log /var/log/nginx/testnode.log;

    # pass the request to the node.js server with the correct headers
    # and much more can be added, see nginx config options
    location / {
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $http_host;
      proxy_set_header X-NginX-Proxy true;

      proxy_pass http://172.17.0.4:8123;
      proxy_redirect off;
    }
 }

credit
http://www.dwmkerr.com/learn-docker-by-building-a-microservice/
https://github.com/dwmkerr/node-docker-microservice

