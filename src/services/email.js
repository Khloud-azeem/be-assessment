import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendEmail = (to, subject, content) => {
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.VERIFICATION_EMAIL,
      pass: process.env.VERIFICATION_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.VERIFICATION_EMAIL,
    to: to,
    subject: subject,
    text: content,
  };

  console.log(`Email ${subject} send successfully`);
  transporter.sendMail(mailOptions, (error, _info) => {
    if (error) throw new Error(`${error}`);
  });
};
export default sendEmail;
