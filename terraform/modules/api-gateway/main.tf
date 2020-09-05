resource "aws_api_gateway_rest_api" "add_stream" {
  name        = "AddStreamsAPI"
  description = "This is an API for checking whether a use can start watching a new stream"
}

# POST: /users/{userId}/streams
resource "aws_api_gateway_resource" "users" {
  rest_api_id = aws_api_gateway_rest_api.add_stream.id
  parent_id   = aws_api_gateway_rest_api.add_stream.root_resource_id
  path_part   = "users"
}

resource "aws_api_gateway_resource" "user" {
  rest_api_id = aws_api_gateway_rest_api.add_stream.id
  parent_id   = aws_api_gateway_resource.users.id
  path_part   = "{userId}"
}

resource "aws_api_gateway_resource" "streams" {
  rest_api_id = aws_api_gateway_rest_api.add_stream.id
  parent_id   = aws_api_gateway_resource.user.id
  path_part   = "streams"
}

resource "aws_api_gateway_method" "add_stream" {
  rest_api_id   = aws_api_gateway_rest_api.add_stream.id
  resource_id   = aws_api_gateway_resource.streams.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "add_stream" {
  rest_api_id             = aws_api_gateway_rest_api.add_stream.id
  resource_id             = aws_api_gateway_resource.streams.id
  http_method             = aws_api_gateway_method.add_stream.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.add_stream_lambda_invoke_arn
}

resource "aws_api_gateway_method_response" "response_200" {
  rest_api_id = aws_api_gateway_rest_api.add_stream.id
  resource_id = aws_api_gateway_resource.streams.id
  http_method = aws_api_gateway_method.add_stream.http_method
  status_code = "200"
}

resource "aws_api_gateway_integration_response" "MyDemoIntegrationResponse" {
  rest_api_id = aws_api_gateway_rest_api.add_stream.id
  resource_id = aws_api_gateway_resource.streams.id
  http_method = aws_api_gateway_method.add_stream.http_method
  status_code = aws_api_gateway_method_response.response_200.status_code
}

resource "aws_api_gateway_deployment" "test" {
  depends_on = [aws_api_gateway_integration.add_stream]

  rest_api_id = aws_api_gateway_rest_api.add_stream.id
  stage_name  = "test"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_lambda_permission" "apigw_add_stream" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.add_stream_lambda_function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:eu-west-2:757782070749:${aws_api_gateway_rest_api.add_stream.id}/*/${aws_api_gateway_method.add_stream.http_method}${aws_api_gateway_resource.streams.path}"
}

