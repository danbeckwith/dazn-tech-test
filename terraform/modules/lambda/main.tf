resource "aws_lambda_function" "add_stream" {
  function_name = "add-stream"

  s3_bucket = "dazn-tech-test-lambda"
  s3_key    = "add-stream"

  role = aws_iam_role.lambda_assume_role.arn

  handler = "index.handler"
  runtime = "nodejs12.x"

  tags = {
    Project        = "dazn-tech-test"
  }
}

resource "aws_iam_role" "lambda_assume_role" {
  name = "add-stream-lambda-iam-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_basic_exec" {
  role       = aws_iam_role.lambda_assume_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "read_update_user_streams" {
  role = aws_iam_role.lambda_assume_role.name
  policy_arn = var.read_update_user_streams_policy_arn
}