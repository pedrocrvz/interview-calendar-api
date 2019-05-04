# Interview calendar API

## Requirements

- [Docker](https://www.docker.com)

## Getting started

Clone this repository.

To connect database and start the API server run:
```
docker-compose up
```

You can interact with the server at:
```
http://localhost:3000
```

## Run tests

```
docker-compose run --rm interview-calendar-api npm test 
```


## API Documentation

I recommend using [Postman](https://www.getpostman.com) to interact and test the API.

You can also do it via terminal following the steps described below.

### Create Candidate

To create a new candidate you should make a POST request to:
```
"localhost:3000/candidates" 
``` 
and the body should contain:

    - Name: String
    - Availability: [
        day: DD/MM/YYYY
        from: HH
        until: HH
    ]

Example:
```
curl -d "{
	\"name\": \"Alice\",
	\"availability\": [
		{\"day\":\"06/05/2019\", \"from\":\"1pm\", \"until\":\"4pm\"},
		{\"day\":\"07/05/2019\", \"from\":\"9am\", \"until\":\"2pm\"},
		{\"day\":\"08/05/2019\", \"from\":\"4pm\", \"until\":\"6pm\"}
	]
}" -H "Content-Type: application/json" -X POST "localhost:3000/candidates"
```




### Create Interviewer

To create a new interviewer you should make a POST request to:
```
"localhost:3000/interviewers" 
```
and the body should contain:

    - Name: String
    - Availability: [
        day: DD/MM/YYYY
        from: HH
        until: HH
    ]

Example:
```
curl -d "{
	\"name\": \"Bob\",
	\"availability\": [
		{\"day\":\"06/05/2019\", \"from\":\"2pm\", \"until\":\"4pm\"},
		{\"day\":\"07/05/2019\", \"from\":\"11am\", \"until\":\"2pm\"},
		{\"day\":\"08/05/2019\", \"from\":\"1pm\", \"until\":\"6pm\"}
	]
}" -H "Content-Type: application/json" -X POST "localhost:3000/interviewers"
```

### List Candidates

To get all candidates you should make a GET request to:
```
"localhost:3000/candidates" 
```
Example:
```
curl -X GET "http://localhost:3000/candidates"
```

### List Interviewers

To get all interviewers you should make a GET request to:
```
"localhost:3000/interviewers" 
```
Example:
```
curl -X GET "http://localhost:3000/interviewers"
```

### Check Availability Intersection

To get all interviewers you should make a GET request to:
```
"localhost:3000/candidates/<CANDIDATE_ID>/intersects?interviewers=<LIST_OF_INTERVIEWERS>"

```
Example:
```
curl -X GET "localhost:3000/candidates/5c7fdf76faac7600109864e8/intersects?interviewers=Bob,Carl"

```

### List Candidate by id

To list a candidate by id you should make a GET request to:
```
"localhost:3000/candidates/:id" 
```
Example:
```
curl -X GET "http://localhost:3000/candidates/5c7fdf76faac7600109864e8"
```

### List Interviewer by id

To list a interviewer by id you should make a GET request to:
```
"localhost:3000/candidates/:id" 
```
Example:
```
curl -X GET "http://localhost:3000/candidates/5c7fdf76faac7600109845t6"
```


### Update Candidate

To update a candidate you should make a PUT request and define in the body the changes you want to update to:

```
"localhost:3000/candidates/:id" 
```

Example:
```
curl -d "{ \"name\": \"Bob\"}" -H "Content-Type: application/json" -X PUT "localhost:3000/candidates/5c7fdf76faac7600109864e8"
```

### Update Interviewer

To update a interviewer you should make a PUT request and define in the body the changes you want to update to:

```
"localhost:3000/candidates/:id" 
```

Example:
```
curl -d "{ \"name\": \"Carl\"}" -H "Content-Type: application/json" -X PUT "localhost:3000/interviewers/5c7fdf76faac7600109845t6"
```

### Delete Candidate

To delete a candidate you should make a DELETE request to:

```
"localhost:3000/candidates/:id" 
```

Example:
```
curl -X DELETE "localhost:3000/candidates/5c7fdf76faac7600109864e8" 
```


### Delete Interviewer

To delete a interviewer you should make a DELETE request to:

```
"localhost:3000/interviewers/:id" 
```

Example:
```
curl -X DELETE "localhost:3000/interviewers/5c7fdf76faac7600109845t6" 
```