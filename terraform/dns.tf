data "cloudflare_zone" "site" {
  name = var.domain
}

resource "cloudflare_record" "acm_validation" {
  for_each = {
    for o in aws_acm_certificate.web.domain_validation_options : o.domain_name => {
      name  = o.resource_record_name
      type  = o.resource_record_type
      value = o.resource_record_value
    }
  }
  zone_id = data.cloudflare_zone.site.id
  name    = trimsuffix(each.value.name, ".")
  type    = each.value.type
  content = trimsuffix(each.value.value, ".")
  ttl     = 60
  proxied = false
}

# DNS-only so CloudFront terminates TLS (no double CDN). Cloudflare flattens the apex CNAME.
resource "cloudflare_record" "apex" {
  zone_id = data.cloudflare_zone.site.id
  name    = "@"
  type    = "CNAME"
  content = aws_cloudfront_distribution.web.domain_name
  ttl     = 300
  proxied = false
}

resource "cloudflare_record" "www" {
  zone_id = data.cloudflare_zone.site.id
  name    = "www"
  type    = "CNAME"
  content = aws_cloudfront_distribution.web.domain_name
  ttl     = 300
  proxied = false
}
