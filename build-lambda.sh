#!/bin/bash

SOURCE="add-stream/"

cd $SOURCE

rm -rf node_modules
rm add-stream.zip

yarn install --production
zip -rq add-stream.zip index.js node_modules/

# TODO add versioning
aws s3api put-object --bucket dazn-tech-test-lambda --key add-stream --body ./add-stream.zip

# aws lambda update-function-code --function-name arn:aws:lambda:eu-west-2:757782070749:function:add-stream --s3-bucket dazn-tech-test-lambda --s3-key add-stream