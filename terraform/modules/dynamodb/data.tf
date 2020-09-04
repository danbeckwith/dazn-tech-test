resource "aws_dynamodb_table_item" "example_user" {
  table_name = aws_dynamodb_table.user_streams.name
  hash_key   = aws_dynamodb_table.user_streams.hash_key
# TODO read these in from file if possible
  item = <<ITEM
{
    "UserId": {
        "S": "388483ieowjds"
    },
    "Name": {
        "S": "User 123"
    },
    "Streams": {
        "L": [
            {
                "M": {
                    "StreamId": {
                        "S": "1927793812"
                    },
                    "Title": {
                        "S": "Man U v Chelsea"
                    },
                    "Finish": {
                        "S": "2020-10-02T11:45:00Z"
                    }
                }
            },
            {
                "M": {
                    "StreamId": {
                        "S": "08e2joik"
                    },
                    "Title": {
                        "S": "The Ashes"
                    },
                    "Finish": {
                        "S": "2020-10-02T13:45:00Z"
                    }
                }
            }
        ]
    }
}
ITEM
}