variable "read_update_user_streams_policy_arn" {
  type = string
  description = "Role ARN for policy which allows read and updates to User Streams table"
}

variable "lambda_name" {
  type = string
  description = "Name for lambda method"
}

variable "tags" {
  type = map(string)
  description = "Tags for AWS Resources"
}

variable "project" {
  type = string
  description = "Project lambda belongs to"
}