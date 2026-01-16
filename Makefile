docker-start:
	npm run build && npm run docker-up && docker exec -it docker-backend-1 npm start
test-watch:
	npm run docker-up && docker exec -it docker-backend-1 npm run test:watch
test-coverage:
	npm run docker-up && docker exec -it docker-backend-1 npm run test:coverage