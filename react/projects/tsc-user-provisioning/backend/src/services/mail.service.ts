import { createTransport, SendMailOptions, TransportOptions } from 'nodemailer';

class MailService {
  private mailer: ReturnType<typeof createTransport>;

  constructor() {
    this.connect();
  }

  private connect() {
    this.mailer = createTransport({
      service: process.env.MAIL_SERVICE,
      port: 587,
      secure: true,
      auth: {
        type: process.env.MAIL_AUTH_TYPE,
        user: process.env.MAIL_AUTH_USER,
        clientId: process.env.MAIL_AUTH_CLIENT_ID,
        clientSecret: process.env.MAIL_AUTH_CLIENT_SECRET,
        accessToken: process.env.MAIL_AUTH_ACCESS_TOKEN,
        refreshToken: process.env.MAIL_AUTH_REFRESH_TOKEN,
      },
    } as TransportOptions);
  }

  public async sendMail({ from = process.env.MAIL_AUTH_USER, ...rest }: SendMailOptions) {
    await this.mailer.sendMail({ from, ...rest });
  }
}

export default MailService;
