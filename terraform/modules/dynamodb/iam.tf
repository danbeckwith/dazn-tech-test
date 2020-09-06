resource "aws_iam_policy" "read_update_user_streams" {
    name = "ReadUpdateUserStreamsTable"
    policy = data.aws_iam_policy_document.read_update_user_streams.json
}
# TODO check these permissions
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