#!/bin/bash

cd "./terraform"

terraform init

terraform apply

./update-lambda-source.sh