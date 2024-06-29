const nodemailer = require('nodemailer');

export default function handler(req, res) {
let transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
user: 'proyection009@gmail.com',
pass: 'hfyn zmif dudw lihd'
}
});
let mailOptions = {
from: 'votre.email@gmail.com',
to: 'proyection009@gmail.com',
subject: 'Envoi d\'email via Node.js',
text: 'Bonjour, ceci est un email envoyé via Node.js et Nodemailer.'
};
transporter.sendMail(mailOptions, function(error, info){
if (error) {
console.log(error);
} else {
console.log('Email envoyé: ' + info.response);
}
});
}