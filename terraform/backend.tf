terraform {
  backend "s3" {
    bucket = "dazn-tech-test-terraform"
    key = "default/tf/terraform.tfstate"
    region = "eu-west-2" 
  }
}