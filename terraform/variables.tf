variable "aws_region" {
  type    = string
  default = "eu-west-1"
}

variable "domain" {
  type    = string
  default = "laise-eduardo.com"
}

variable "github_repo" {
  description = "owner/repo allowed to assume the deploy role"
  type        = string
  default     = "LaiseEduardo/laise-eduardo.com"
}
