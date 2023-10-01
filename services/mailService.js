import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

class MailService {
    constructor() {
        var mailConfig;
        if(process.env.NODE_ENV === "production"){
            console.log('production');
            mailConfig = {
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: true,
                tls: {
                    // do not fail on invalid certs
                    rejectUnauthorized: false
                },
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD
                }
            }
        } else {
            mailConfig = {
                host: process.env.DEV_SMTP_HOST,
                port: process.env.DEV_SMTP_PORT,
                secure: false,
                auth: {
                    user: process.env.DEV_SMTP_USER,
                    pass: process.env.DEV_SMTP_PASSWORD
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
    async sendMail(to, message) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: "Hello World",
            text: message
        })
    }
}

export default new MailService()