output "web_bucket_name" { value = aws_s3_bucket.web.bucket }
output "web_cloudfront_distribution_id" { value = aws_cloudfront_distribution.web.id }
output "web_cloudfront_domain" { value = aws_cloudfront_distribution.web.domain_name }
output "deploy_role_arn" { value = aws_iam_role.deploy.arn }
