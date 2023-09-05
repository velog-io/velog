import { SendEmailCommand, __MetadataBearer } from '@aws-sdk/client-ses'
import { AwsService } from '@lib/aws/AwsService.js'
import { injectable, singleton } from 'tsyringe'
import sanitizeHtml from 'sanitize-html'

@injectable()
@singleton()
export class MailService {
  constructor(private readonly aws: AwsService) {}
  public async sendMail({ to, subject, body, from }: EmailParams): Promise<__MetadataBearer> {
    const sendEmailCommand = this.createSendEmailCommand({ to, subject, body, from })
    try {
      return await this.aws.ses.send(sendEmailCommand)
    } catch (error) {
      throw error
    }
  }
  private createSendEmailCommand({ to, subject, body, from }: EmailParams) {
    return new SendEmailCommand({
      Destination: {
        ToAddresses: typeof to === 'string' ? [to] : to,
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: body,
          },
          Text: {
            Charset: 'UTF-8',
            Data: sanitizeHtml(body, {
              allowedAttributes: { a: ['style'] },
              allowedStyles: {
                a: {
                  width: [/^\d+(?:px|em|%)$/],
                },
              },
            }),
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: from,
    })
  }
}

type EmailParams = {
  to: string | string[]
  subject: string
  body: string
  from: string
}
