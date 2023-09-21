import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

class MailService {
    constructor() {
        var mailConfig;
        if(process.env.NODE_ENV === "production"){
            console.log('priduction');
            mailConfig = {
                service: "Yandex",
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: true,
                tls: {
                    servername: "purple-test.ru",
                    rejectUnauthorized: true,
                    minVersion: "TLSv1.2"
                },
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD
                }
            }
        } else {
            mailConfig = {
                host: "smtp.ethereal.email",
                port: 587,
                secure: false,
                auth: {
                    user: "edmund.deckow37@ethereal.email",
                    pass: "8B2mJqbB6t1TCNUxjg"
                }
            }
        }
        this.transporter = nodemailer.createTransport(mailConfig)
    }
    async sendActivation(to, otp) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: "Активация аккаунта",
            text: `Код активации: ${otp}`
        })
    }
}

export default new MailService()