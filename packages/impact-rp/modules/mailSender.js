module.exports.Init = () => {
    mp.mailer = {};
    mp.mailer.sendMail = (to, subject, message) => {
        var nodemailer = require("nodemailer");
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'bkstudio.dev',
              pass: 'BKStudio4ever'
            }
        });
        message += "<br /><br /> С Уважением, Команда BKStudio RP.";
        const mailOptions = {
            from: 'bkstudio.dev@gmail.com',
            to: to,
            subject: subject,
            html: message
        };
        transporter.sendMail(mailOptions, function(err, info) {
            if (err) console.log(err)
            else console.log(info);
        });
    }
}
