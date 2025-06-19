const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 5000;

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB Connection
mongoose.connect(
  'mongodb+srv://pardhanrohit3656:Rohit00pal@pixnovadb.dvjvyr0.mongodb.net/pixnova?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1); // Stop server if DB fails
});

// ✅ Order Schema
const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  number: { type: String, required: true },
  items: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// ✅ Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',       // ✅ Replace with your Gmail
    pass: 'your-app-password'           // ✅ Replace with your Gmail App Password
  }
});

const sendConfirmationEmail = (order) => {
  const mailOptions = {
    from: 'your-email@gmail.com',       // ✅ Same as above
    to: order.email,
    subject: 'Your PixNova Order is Confirmed! 🎉',
    html: `
      <h2>Hi ${order.name},</h2>
      <p>Thank you for your order at <strong>PixNova</strong>!</p>
      <p><strong>Order Details:</strong></p>
      <ul>
        <li><strong>Items:</strong> ${order.items}</li>
        <li><strong>Phone Number:</strong> ${order.number}</li>
        <li><strong>Order Date:</strong> ${order.date.toDateString()}</li>
      </ul>
      <p>We’ll reach out soon with delivery details.</p>
      <p>Best Regards,<br/>PixNova Team</p>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('❌ Email send failed:', error);
    } else {
      console.log('✅ Email sent:', info.response);
    }
  });
};

// ✅ Test Endpoint
app.get('/', (req, res) => {
  res.send('🎉 Order API is running!');
});

// ✅ Save Order Endpoint
app.post('/api/order', async (req, res) => {
  const { name, email, number, items } = req.body;

  if (!name || !email || !number || !items) {
    return res.status(400).json({ message: '❌ Please provide name, email, number, and items.' });
  }

  try {
    const newOrder = new Order({ name, email, number, items });
    const savedOrder = await newOrder.save();
    console.log('✅ Order saved:', savedOrder);

    // ✅ Send confirmation email
    sendConfirmationEmail(savedOrder);

    res.status(200).json({ message: '✅ Order saved & email sent!', order: savedOrder });
  } catch (err) {
    console.error('❌ Failed to save order:', err.message);
    res.status(500).json({ message: '❌ Server error while saving order.', error: err.message });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
