# dazn-tech-test

## How to build and deploy

### First time running/deploying
1. Create buckets for lambda source (`dazn-tech-test-lambda`) and terraform state (`dazn-tech-test-terraform`).
1. Replace the AWS Account number (757782070749) with your own in the `yarn run deploy` script in `./add-stream/package.json`
1. Package the lambda source by running `yarn run build` in `./add-stream`.
1. Release lambda source bundle to the S3 bucket by running `yarn run release` in `./add-stream`.
1. Provision the AWS resources defined in terraform by running `./provision.sh` in `./terraform`.

### Subsquent deployments

- Update AWS resources by running `./provision.sh` in `./terraform`.
- Package, release and update lambda code by running `yarn run build-release-deploy` in `./add-stream`

## How to hit API

Example cURL:
```
curl -X POST -H "Content-Type: application/json" \
 -d '{"streamId":"456"}' \                 
 https://stafxrasn4.execute-api.eu-west-2.amazonaws.com/test/users/123/streams
```
or use the Postman config files in `./postman`

## Scalability Strategy

As this project has been provisioned solely with AWS Resources it will be highly scalable. 

API Gateway will automatically scale if there are sudden bursts of traffic. By default, API Gateway allows 10000 requests per second, any more than this and it will start to throttle. If this is not enough then this value can be increased or throttling can be removed altogether. If needed, usage plans can be devised for individual consumers of the API so throttling can be configured on a case by case basis. 

Like API Gateway, Lambdas will scale automatically based on traffic. Concurrency can be reserved per lambda if particular lambdas expect more load. Secondly, you can now provision concurrency for lambda functions, reducing the impact of cold starts when receiving large influxes of traffic. This can ensure consistent start-up latency for up to the defined capacity.

Lastly, DynamoDB can be configured considering your expected load. The DynamoDB table in this project has been provisioned with 20 read and write capacity units but this can be increased. Additionally, DynamoDB offers on-demand capacity which will scale automatically based on load, like Lambda and API Gateway.

Although these resources allow highly scalable systems, it is always important to consider how the throughput will affect downstream systems. If there is risk of overwhelming other systems then it is worth implementing a usage plan (as mentioned above) on your API to throttle requests.