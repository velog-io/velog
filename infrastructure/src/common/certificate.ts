import * as aws from '@pulumi/aws'
import { ENV } from '../../env'

const certificate = aws.acm.getCertificate({
  domain: ENV.certificateDomain,
})

export const certificateArn = certificate.then((certificate) => certificate.arn)
