module.exports.Init = () => {
    mp.mailer = {};
    mp.mailer.sendMail = (to, subject, message) => {
        var nodemailer = require("nodemailer");
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'impact.rageroleplay',
              pass: 'Impact_RP_Pass'
            }
        });
        message += "<br /><br /> С Уважением, Команда Impact RP.";
        const mailOptions = {
            from: 'impact_rp@gmail.com',
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
