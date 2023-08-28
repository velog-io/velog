import * as aws from '@pulumi/aws'

export const getCertificate = (domain: string) => {
  const certificate = aws.acm.getCertificate({
    domain,
  })
  const certificateArn = certificate.then((certificate) => certificate.arn)
  return certificateArn
}
