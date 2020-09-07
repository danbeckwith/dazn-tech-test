# dazn-tech-test

## Description

A service which exposes an API that will verify whether a user can watch a new stream based on how many streams they are currently watching. The API exposes a POST endpoint `/users/{userId}/streams` which accepts a JSON body containing a `streamId`:
```
{"streamId":"{streamId}"}
```
This is routed to a lambda proxy integration which validates the input parameters and attempts a conditional update on a DynamoDB table, UserStreams. This table stores the UserId of the user and the streams the user is current watching in a Streams array. Example body:
```
{
    "UserId": "user2"
    "Streams": [
        "abc",
        "def",
        "hij"
    ]
}
```
The conditional update will update the Streams array of the object if there are less than three streams in the array at the time of update. Based on the assumption that when calling this endpoint the consumer have validated the user, the conditional update will create a new UserStreams entity if one does not already exist.

### Further work

This table could be managed by a separate service which periodically removes users who are no longer online and removes streams which have finished.

## How to build and deploy

### Requirements

- aws cli
- yarn
- node v12
- terraform

### First time deploying
1. Create buckets for lambda source (`dazn-tech-test-lambda`) and terraform state (`dazn-tech-test-terraform`).
1. Package the lambda source by running `yarn run build` in `./add-stream`.
1. Release lambda source bundle to the S3 bucket by running `yarn run release` in `./add-stream`.
1. Provision the AWS resources defined in terraform by running `./provision.sh` in `./terraform`.

### Subsquent deployments

- Update AWS resources by running `./provision.sh` in `./terraform`.
- Package, release and update lambda code by running `yarn run build-release-deploy` in `./add-stream`

## Testing

### Unit Tests

Unit tests have been created with the Jest test framework and can be run with: `yarn run test` inside of `./add-stream`

### How to consume API

API Url: `https://stafxrasn4.execute-api.eu-west-2.amazonaws.com/test/users/123/streams`

Example cURL:
```
curl -X POST -H "Content-Type: application/json" \
 -d '{"streamId":"456"}' \                 
 https://stafxrasn4.execute-api.eu-west-2.amazonaws.com/test/users/123/streams
```
or use the Postman config files in `./postman`

The Terraform config creates two items in the DynamoDB table automatically so you can begin testing straight away:
- UserId: `user1` only has 1 stream currently being watched
- UserId: `user2` is currently watching 3 streams

## Scalability Strategy

As this project has been provisioned solely with AWS Resources it will be highly scalable. 

API Gateway will automatically scale if there are sudden bursts of traffic. By default, API Gateway allows 10000 requests per second, any more than this and it will start to throttle. If this is not enough then this value can be increased or throttling can be removed altogether. If needed, usage plans can be devised for individual consumers of the API so throttling can be configured on a case by case basis. 

Like API Gateway, Lambdas will scale automatically based on traffic. Concurrency can be reserved per lambda if particular lambdas expect more load, or they can simply use the reserved capacity in the account. Secondly, you can now provision concurrency for lambda functions, reducing the impact of cold starts when receiving large influxes of traffic. This can ensure consistent start-up latency for up to the defined capacity. 

Lastly, DynamoDB can be configured considering your expected load. The DynamoDB table in this project has been provisioned with 20 read and write capacity units but this can be increased. Additionally, DynamoDB offers on-demand capacity which will scale automatically based on load, like Lambda and API Gateway.

Although these resources allow highly scalable systems, it is always important to consider how the throughput will affect downstream systems. If there is risk of overwhelming other systems then it is worth implementing a usage plan (as mentioned above) on your API to throttle requests.