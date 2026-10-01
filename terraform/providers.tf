terraform {
  required_version = ">= 1.9.0"
  required_providers {
    aws        = { source = "hashicorp/aws", version = "~> 5.0" }
    cloudflare = { source = "cloudflare/cloudflare", version = "~> 4.0" }
  }
}

locals {
  tags = { Project = "laise-eduardo.com", ManagedBy = "terraform" }
}

provider "aws" {
  region = var.aws_region
  default_tags { tags = local.tags }
}

# CloudFront only accepts ACM certificates issued in us-east-1.
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
  default_tags { tags = local.tags }
}

# Auth via CLOUDFLARE_API_TOKEN env var (Zone:DNS:Edit on laise-eduardo.com).
provider "cloudflare" {}
