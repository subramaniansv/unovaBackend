const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
<<<<<<< HEAD
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
=======
>>>>>>> 1785855 (trying to ressolve cors conflict)

// Apply CORS middleware with the options
const allowedOrigins = ['http://localhost:5173', 'https://unova.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(bodyParser.json());

// Email Transporter Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.MY_EMAIL_PASSWORD,
  },
});


// Handle Contact Form
app.post("/api/contact", async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    // Send Email to You
    await transporter.sendMail({
      from: process.env.MY_EMAIL,
      to: process.env.MY_EMAIL,
      subject: `New Contact from ${name}`,
      html: `
        <h2>New Contact Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not Provided'}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    });

    // Confirmation Email to Client
    await transporter.sendMail({
      from: process.env.MY_EMAIL,
      to: email,
      subject: "Thanks for contacting Unova!",
      html: `<p>Hi ${name},<br/>Thanks for reaching out! We’ll get back to you shortly.</p>`,
    });

    res.status(200).json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
