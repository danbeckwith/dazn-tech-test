resource "aws_dynamodb_table_item" "example_user" {
  table_name = aws_dynamodb_table.user_streams.name
  hash_key   = aws_dynamodb_table.user_streams.hash_key

  item = <<ITEM
{
  "Streams": {
    "L": [
      {
        "S": "39084902"
      },
      {
        "S": "ddd"
      },
      {
        "S": "pjfpisdkm"
      }
    ]
  },
  "UserId": {
    "S": "dsad"
  }
}
ITEM
}