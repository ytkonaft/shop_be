const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
});

const mailTemplate = text => `
    <div className="email-wrp" style="
        border: 1px solid #000;
        padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 18px;
    ">
    <h2>Email title</h2>
    <p>${text}</p>
    </div>
`;

exports.transport = transport;
exports.mailTemplate = mailTemplate;
