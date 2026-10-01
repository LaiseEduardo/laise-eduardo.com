# Create the state bucket once, by hand, before `terraform init`:
#   aws s3api create-bucket --bucket laise-eduardo-com-terraform-state --region eu-west-1 \
#     --create-bucket-configuration LocationConstraint=eu-west-1
#   aws s3api put-bucket-versioning --bucket laise-eduardo-com-terraform-state \
#     --versioning-configuration Status=Enabled
terraform {
  backend "s3" {
    bucket       = "laise-eduardo-com-terraform-state"
    key          = "laise-eduardo.com/terraform.tfstate"
    region       = "eu-west-1"
    use_lockfile = true
    encrypt      = true
  }
}
