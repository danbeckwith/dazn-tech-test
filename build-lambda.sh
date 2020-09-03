#!/bin/bash

SOURCE="add-stream/"

cd $SOURCE

rm -rf node_modules
rm add-stream.zip

yarn install --production
zip -rq add-stream.zip .

# TODO add versioning
aws s3api put-object --bucket dazn-tech-test-lambda --key add-stream --body ./add-stream.zip