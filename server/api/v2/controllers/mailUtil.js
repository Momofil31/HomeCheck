const nodemailer = require('nodemailer');

const user = process.env.MAIL_ADDRESS;
const pass = process.env.MAIL_PW;

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user,
    pass,
  },
});

exports.resetPasswordMail = async (email, password) => {
  if (process.env.NODE_ENV === 'test') {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    const testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
  }

  const htmlMail = `<p>Here is your new password.</p>
                      <h4>${password}</h4> 
                    `;
  const textMail = `Here is your new password: ${password}`;

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"Homecheck" ${user}`, // sender address
    to: `${email}`, // list of receivers
    subject: 'Reset Password', // Subject line
    text: textMail, // plain text body
    html: htmlMail, // html body
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};

exports.confirmationEmail = async (email, name, link, token) => {
  if (process.env.NODE_ENV === 'test') {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    const testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
  }

  const htmlMail = `<p>Hello ${name}, <br/>to confirm your account and start using Homecheck go to this link:<br><a href="${link}">${link}</a></p>
                    <p>If you want to use the API instead here is the token: <br>${token}</p>`;
  const textMail = `Hello ${name}, to confirm your account and start using Homecheck go to this link: ${link}.
                    If you want to use the API instead here is the token: ${token}`;

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"Homecheck" ${user}`, // sender address
    to: `${email}`, // list of receivers
    subject: 'Email Confirmation', // Subject line
    text: textMail, // plain text body
    html: htmlMail, // html body
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};
