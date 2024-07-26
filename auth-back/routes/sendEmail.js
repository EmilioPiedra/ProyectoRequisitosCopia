// routes/sendEmail.js
const nodemailer = require('nodemailer');

// Configura el transporte de correo (aquí se usa Gmail como ejemplo)
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER, // Tu correo electrónico
        pass: process.env.EMAIL_PASS  // Tu contraseña de correo electrónico (o una contraseña de aplicación)
    }
});

async function sendEmail(to, subject, text) {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Tu correo electrónico
        to,
        subject,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo electrónico enviado');
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
        throw error;
    }
}

module.exports = sendEmail;
