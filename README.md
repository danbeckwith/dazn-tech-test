# dazn-tech-test

## How to build and deploy

1. Create buckets for lambda source (`dazn-tech-test-lambda`) and terraform state (`dazn-tech-test-terraform`)
1. Run `./build-lambda` to package and deploy function to S3
1. Run `./provision.sh` to run terraform and provision infrastructure