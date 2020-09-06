module "add_stream_lambda" {
  source = "./modules/lambda"

  read_update_user_streams_policy_arn = module.user_streams_table.read_update_user_streams_policy_arn
}

module "user_streams_table" {
  source = "./modules/dynamodb"
}

module "add_stream_api" {
  source = "./modules/api-gateway"

  add_stream_lambda_invoke_arn = module.add_stream_lambda.invoke_arn
  add_stream_lambda_function_name = module.add_stream_lambda.function_name
}

# TODO clean up Terraform code/parameterise/break up files