module "add-stream-lambda" {
  source = "./modules/lambda"

  read_update_user_streams_policy_arn = module.user_streams_table.read_update_user_streams_policy_arn
}

module "user_streams_table" {
  source = "./modules/dynamodb"
}