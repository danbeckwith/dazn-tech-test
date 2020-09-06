resource "aws_dynamodb_table_item" "example_user" {
  table_name = aws_dynamodb_table.user_streams.name
  hash_key   = aws_dynamodb_table.user_streams.hash_key

  item = <<ITEM
{
  "Streams": {
    "L": [
      {
        "S": "abc"
      },
      {
        "S": "def"
      },
      {
        "S": "hij"
      }
    ]
  },
  "UserId": {
    "S": "1234abcd"
  }
}
ITEM
}