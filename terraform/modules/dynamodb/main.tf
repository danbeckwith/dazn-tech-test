resource "aws_dynamodb_table" "user_streams" {
  name           = "UserStreams"
  billing_mode   = "PROVISIONED"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "UserId"

  attribute {
    name = "UserId"
    type = "S"
  }

  tags = var.tags
}

output "read_update_user_streams_policy_arn" {
    value = aws_iam_policy.read_update_user_streams.arn
}