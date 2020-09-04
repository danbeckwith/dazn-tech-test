#!/bin/bash

cd "./terraform"

terraform init

terraform applyaws lambda update-function-code --function-name arn:aws:lambda:eu-west-2:757782070749:function:add-stream --s3-bucket dazn-tech-test-lambda --s3-key add-stream