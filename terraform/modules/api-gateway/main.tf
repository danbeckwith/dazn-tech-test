resource "aws_api_gateway_rest_api" "add_stream" {
  name        = "AddStreamsAPI"
  description = "This is an API for checking whether a use can start watching a new stream"
}

resource "aws_api_gateway_resource" "add_stream" {
  rest_api_id = aws_api_gateway_rest_api.add_stream.id
  parent_id   = aws_api_gateway_rest_api.add_stream.root_resource_id
  path_part   = "streams"
}

resource "aws_api_gateway_method" "add_stream" {
  rest_api_id   = aws_api_gateway_rest_api.add_stream.id
  resource_id   = aws_api_gateway_resource.add_stream.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "add_stream" {
  rest_api_id             = aws_api_gateway_rest_api.add_stream.id
  resource_id             = aws_api_gateway_resource.add_stream.id
  http_method             = aws_api_gateway_method.add_stream.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.add_stream_lambda_invoke_arn
}

# Lambda
resource "aws_lambda_permission" "apigw_add_stream" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.add_stream_lambda_function_name
  principal     = "apigateway.amazonaws.com"

  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
  source_arn = "arn:aws:execute-api:eu-west-2:757782070749:${aws_api_gateway_rest_api.add_stream.id}/*/${aws_api_gateway_method.add_stream.http_method}${aws_api_gateway_resource.add_stream.path}"
}

