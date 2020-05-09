start:
	node app.js

test-ping:
	curl localhost:8080/ping

docker-build:
	docker build -t jojojoseph09/carrental .
	docker images

docker-run:
	docker run --name carrental -td -p 8080:8080 jojojoseph09/carrental
	docker ps

docker-push:
	docker push jojojoseph09/carrental
