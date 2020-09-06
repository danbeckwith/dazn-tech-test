resource "aws_dynamodb_table_item" "example_user" {
  table_name = aws_dynamodb_table.user_streams.name
  hash_key   = aws_dynamodb_table.user_streams.hash_key

  item = <<ITEM
{
  "Streams": {
    "L": [
      {
        "S": "abc"
      }
    ]
  },
  "UserId": {
    "S": "user1"
  }
}
ITEM
}

resource "aws_dynamodb_table_item" "example_three_streams_user" {
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
    "S": "user2"
  }
}
ITEM
}