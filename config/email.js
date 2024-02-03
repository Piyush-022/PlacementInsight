const nodemailer = require("nodemailer");
require("dotenv").config();
try {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
} catch (error) {
  console.log("error while settig up SMTP");
}

exports.sendmail = async (req, res) => {
  const email = req.email;
  const url = req.url;
  try {
    const response = await transporter.sendMail({
      to: email,
      subject: "Verify Account",
      html: `<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }

    h1 {
      color: #3498db;
    }

    p {
      margin-bottom: 20px;
    }

    .verification-link {
      display: inline-block;
      padding: 10px 20px;
      background-color: #3498db;
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Email Verification</h1>
    <p>Dear user, thank you for signing up. Please click the following link to verify your email:</p>
    <a href='${url}' class="verification-link">Verify Email</a>
    <p>If the above button doesn't work, you can also copy and paste the following link into your browser:</p>
    <p>'${url}'</p>
  </div>
</body>
</html>`,
    });
    res.status(200).json({
      verified: false,
      message: "verification email successfully sent",
    });
  } catch (error) {
    res.status(500).json({
      verified: false,
      error: "user created but error while sending verification email",
    });
  }
};
