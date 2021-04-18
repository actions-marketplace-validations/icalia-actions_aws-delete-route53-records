# AWS Delete Route53 Records

Deletes DNS records in a given AWS Route53 Hosted Zone

## Usage

```yaml
      - name: Delete AWS Route53 Records
        uses: icalia-actions/aws-delete-route53-records@v0.0.1
        with:
          hosted-zone-id: ROUTE53_HOSTED_ZONE_ID
          records: |
            [
              {
                "Name": "record-name.your-domain.tld.",
                "Type": "A",
                "AliasTarget": {
                  "HostedZoneId": "TARGET_HOSTED_ZONE_ID",
                  "DNSName": "dualstack.my-load-balancer.my-region.elb.amazonaws.com.",
                  "EvaluateTargetHealth": true
                }
              }
            ]
          comment: An optional comment that describes the purpose of the removal
```

### Using record template files:

You can also use an additional json or yaml file like this:

```yaml
# tmp/example.yml
- Name: subdomain1.my-domain.tld.
  Type: A
  AliasTarget: &target
    HostedZoneId: TARGET_HOSTED_ZONE_ID
    DNSName: dualstack.my-load-balancer.my-region.elb.amazonaws.com.
    EvaluateTargetHealth: true

- Name: subdomain2.my-domain.tld.
  Type: A
  AliasTarget:
    <<: *target
```

```yaml
      - name: Configure AWS Route53 Records
        uses: icalia-actions/aws-delete-route53-records@v0.0.1
        with:
          hosted-zone-id: ROUTE53_HOSTED_ZONE_ID
          records: tmp/example.yml
          comment: An optional comment that describes the purpose of the removal
```