# dazn-tech-test

## How to build and deploy

1. Create buckets for lambda source (`dazn-tech-test-lambda`) and terraform state (`dazn-tech-test-terraform`)
1. Run `./build-lambda.sh` to package and deploy function to S3
1. Run `./update-lambda-source.sh` to trigger lambda to pull in latest code in S3
1. Run `./provision.sh` to run terraform and provision infrastructure

## How to hit API

Example cURL:
```
curl -X POST -H "Content-Type: application/json" \
 -d '{"streamId":"456"}' \                 
 https://stafxrasn4.execute-api.eu-west-2.amazonaws.com/test/users/123/streams
```


<!-- TODO add postman pack -->