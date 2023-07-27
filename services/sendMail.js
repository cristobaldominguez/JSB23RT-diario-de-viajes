const nodemailer = require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid')

const { SMTP_USER, SENDGRID_KEY } = process.env

const transport = nodemailer.createTransport(
  sendGridTransport({
    apiKey: SENDGRID_KEY,
  })
)

async function sendMail(email, subject, body) {
  try {
    const mailOptions = {
      from: SMTP_USER,
      to: email,
      subject,
      text: body
    }

    await transport.sendMail(mailOptions)
  } catch (err) {
    return err
  }
}

module.exports = sendMail
