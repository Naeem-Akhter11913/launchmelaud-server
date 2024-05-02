const nodemailer = require("nodemailer");
const { promisify } = require('util');
const fs = require('fs');

const readFileAsync = promisify(fs.readFile);



// ----------------------------------[ checks email settings ]----------------------------------------

const test_send_email_settings = async (data) => {
    try {
        // const emailData = await testloadTemplate(data);
        const emailData = await loadTemplate(data);

        const transporter = nodemailer.createTransport({

            host: `${data.send_email_host}`,
            port: `${data.send_email_port}`,
            secure: true,
            auth: {
                user: `${data.send_email_from}`,
                pass: `${data.send_email_password}`,
            }
        });

        await transporter.sendMail({

            from: `${data.send_email_from}`,
            to: data.reply_to_email,
            replyTo: 'replyto@example.com',
            subject: emailData['subject'],
            text: emailData['body'],
            html: emailData['body'],
        });

        return true;

    } catch (error) {

        return false;
    }
};

// const testloadTemplate = async (data) => {

//     try {
//         let filePath = `src/sender/templates/${data.fileName}`;
//         const datas = await readFileAsync(filePath, 'utf8');

//         let htmlContent = [];
//         if (data.fileName === "checkSendEmail.html") {
//             htmlContent['subject'] = 'This is your your send email template';
//             htmlContent['body'] = datas.replace('[name]', data.reply_to_name);
//         }
//         return htmlContent;

//     } catch (err) {
//         console.error('Error reading HTML file:', err);
//         throw err;
//     }
// };

// -----------------------------[]----------------------------- 



const sendEmail = async (data) => {
    try {
        const emailData = await loadTemplate(data);

        const transporter = nodemailer.createTransport({

            // host: 'mail.intolap.com',
            host: 'mail.launchmeloud.com',
            port: 465,
            secure: true,
            auth: {
                // user: 'devtest@intolap.com',
                user: 'hello@launchmeloud.com',
                // pass: 'r9$Py}h[Oq-5',
                pass: '7MkbqO.iN=UH',
            },
        });

        await transporter.sendMail({
            // from: 'devtest@intolap.com',
            from: 'hello@launchmeloud.com',
            to: data.email,
            // replyTo: 'replyto@example.com',
            subject: emailData['subject'],
            text: emailData['body'],
            html: emailData['body']
        });

        console.log("email sent sucessfully");
        return true
    } catch (error) {
        console.log(error, "email not sent");
        return false
    }
};

const sendActivationEmail = async (data) => {
    try {
        const transporter = nodemailer.createTransport({
            // host: 'mail.intolap.com',
            host: 'mail.launchmeloud.com',
            port: 465,
            secure: true,
            auth: {
                // user: 'devtest@intolap.com',
                user: 'hello@launchmeloud.com',
                // pass: 'r9$Py}h[Oq-5',
                pass: '7MkbqO.iN=UH',
            },
        });

        const emailData = await loadTemplate(data);

        await transporter.sendMail({
            // from: '"launchmeloud" <devtest@intolap.com>',
            from: '"launchmeloud" <hello@launchmeloud.com>',
            to: data.email,
            subject: emailData['subject'],
            text: emailData['body'],
            html: emailData['body']
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

const loadTemplate = async (data) => {
    try {
        let filePath = `src/sender/templates/${data.fileName}`;
        const datas = await readFileAsync(filePath, 'utf8');

        let htmlContent = [];
        if (data.fileName === "activeAccount.html") {
            htmlContent['subject'] = 'Active Your Account';
            htmlContent['body'] = datas.replace('[name]', data.name).replace('[link]', data.link);

        } else if (data.fileName === "newUser.html") {
            htmlContent = datas.replace('[user_details]', data.user_details);
        } else if (data.fileName === "teamTransfer.html") {
            htmlContent = datas.replace('[user_details]', data.user_details).replace('[name]', data.name)

        } else if (data.fileName === "resetPassword.html") {
            htmlContent['subject'] = 'Reset Your Password';
            htmlContent['body'] = datas.replace('[name]', data.name).replace('[link]', data.link);


        } else if (data.fileName === "resetSession.html") {
            htmlContent = datas.replace('[name]', data.name).replace('[link]', data.link);

        } else if (data.fileName === "subsReport.html") {
            htmlContent['subject'] = 'Congratulations 🎊🎊🎊';
            // htmlContent['body'] = datas.replace('[user_details]', data.user_details);
            htmlContent['body'] = datas.replace('[name]', data.honorName).replace('[user_details]', data.name);

        } else if (data.fileName === "toAdmin.html") {
            htmlContent['subject'] = 'Register One New User';
            htmlContent['body'] = datas.replace('[user_name]', data.username).replace('[admin]', data.adminName).replace('[user_email]', data.userEmail)

        } else if (data.fileName === "clientToAdmin.html") {
            htmlContent['subject'] = 'Request to Contact';
            htmlContent['body'] = datas
                .replace('[user_name]', data.username)
                .replace('[user_email]', data.userEmail)
                .replace('[user_subject]', data.subject)
                .replace('[admin]', data.adminName)
                .replace('[user_msg]', data.message)

        } else if (data.fileName === "OTP.html") {
            htmlContent['subject'] = 'ONE TIME PASSWORD';
            htmlContent['body'] = datas
                .replace('[name]', data.username)
                .replace('[user_email]', data.useremail)
                .replace('[OTP]', data.otp)

        } else if (data.fileName === "checkSendEmail.html") {
            htmlContent['subject'] = 'This is your your send email template';
            htmlContent['body'] = datas.replace('[name]', data.reply_to_name);
        }


        return htmlContent;
    } catch (err) {
        console.error('Error reading HTML file:', err);
        throw err;
    }
};


module.exports = { sendEmail, loadTemplate, sendActivationEmail, test_send_email_settings };
