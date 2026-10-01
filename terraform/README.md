# Infra

One environment (prod). Applied by hand from a laptop with admin AWS credentials.

1. Create the state bucket (see `backend.tf` header) — once.
2. `export CLOUDFLARE_API_TOKEN=...` (Zone:DNS:Edit on laise-eduardo.com).
3. `terraform -chdir=terraform init && terraform -chdir=terraform plan`
4. `terraform -chdir=terraform apply`
5. Put `deploy_role_arn`, `web_bucket_name`, `web_cloudfront_distribution_id` into the GitHub `production` environment variables `AWS_DEPLOY_ROLE_ARN`, `WEB_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID`.
