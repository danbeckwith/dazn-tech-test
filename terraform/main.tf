locals {
  project = "dazn-tech-test"
  lambda = "add-stream"

  tags = {
    Owner = "Daniel Beckwith"
    Project = "dazn-tech-test"
  }
}

module "add_stream_lambda" {
  source = "./modules/lambda"

  read_update_user_streams_policy_arn = module.user_streams_table.read_update_user_streams_policy_arn
  lambda_name = local.lambda
  tags = local.tags
  project = local.project
}

module "user_streams_table" {
  source = "./modules/dynamodb"

  tags = local.tags
}

module "add_stream_api" {
  source = "./modules/api-gateway"

  add_stream_lambda_invoke_arn = module.add_stream_lambda.invoke_arn
  add_stream_lambda_function_name = module.add_stream_lambda.function_name
  tags = local.tags
}