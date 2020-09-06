variable "add_stream_lambda_invoke_arn" {
  type = string
  description = "Invoke ARN for Add Stream Lambda for API Gateway integration"
}

variable "add_stream_lambda_function_name" {
  type = string
  description = "Invoke ARN for Add Stream Lambda for API Gateway permissions"
}

variable "tags" {
  type = map(string)
  description = "Tags for AWS Resources"
}