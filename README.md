curl -X POST http://localhost:5000/api/tenant   -H 'Content-Type: application/json'  -H 'cache-control: no-cache'   -d '{
    "name":"ten",
    "description":"sample description",
    "option":{}
}'

curl -X POST http://localhost:5000/api/tenants-42284e3b-0aa3-4fb6-bf5d-ae621373daf5/topic \
  -H 'Content-Type: application/json' -H 'cache-control: no-cache' \
  -d '{
	"tenantId":"tenants-42284e3b-0aa3-4fb6-bf5d-ae621373daf5",
	"name":"iii",
	"description":"xnn desc",
	"option":{}
}'


curl -X GET http://localhost:5000/api/tenants-42284e3b-0aa3-4fb6-bf5d-ae621373daf5/topic \
  -H 'cache-control: no-cache'


curl -X POST http://localhost:5000/api/topics-21cddcd9-5597-4b9d-b101-b1354a426836/messages \
  -H 'Content-Type: application/json' -H 'cache-control: no-cache' \
  -d '{
    "data":{
    	"message":"helllouuupppp"
    }
}'


{"event":"login", "data":{"token":{"userId":1}}}
{"event":"data", "data":{"topicId":"topics-21cddcd9-5597-4b9d-b101-b1354a426836","data":{"message":"hello"}}}
