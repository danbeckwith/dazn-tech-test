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

resource "aws_api_gateway_integration_response" "integration_response_200" {
  rest_api_id = aws_api_gateway_rest_api.add_stream.id
  resource_id = aws_api_gateway_resource.streams.id
  http_method = aws_api_gateway_method.add_stream.http_method
  status_code = aws_api_gateway_method_response.response_200.status_code
}