resource "aws_dynamodb_table" "user_streams" {
  name           = "UserStreamsTable"
  billing_mode   = "PROVISIONED"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "UserId"

  attribute {
    name = "UserId"
    type = "S"
  }

  tags = {
    Project        = "dazn-tech-test"
  }
}

resource "aws_iam_policy" "read_update_user_streams" {
    name = "ReadUpdateUserStreamsTable"
    policy = data.aws_iam_policy_document.read_update_user_streams.json
}

data "aws_iam_policy_document" "read_update_user_streams" {
    statement {
        actions = [
            "dynamodb:GetItem",
            "dynamodb:Query",
            "dynamodb:Scan",
            "dynamodb:UpdateItem"
        ]

        resources = [
            aws_dynamodb_table.user_streams.arn
        ]
    }
}

output "read_update_user_streams_policy_arn" {
    value = aws_iam_policy.read_update_user_streams.arn
}