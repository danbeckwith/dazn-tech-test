resource "aws_lambda_function" "add_stream" {
  function_name = var.lambda_name

  s3_bucket = "${var.project}-lambda"
  s3_key    = "add-stream"

  role = aws_iam_role.lambda_assume_role.arn

  handler = "index.handler"
  runtime = "nodejs12.x"

  tags = var.tags
}

output "invoke_arn" {
  value = aws_lambda_function.add_stream.invoke_arn
}

output "function_name" {
  value = aws_lambda_function.add_stream.function_name
}