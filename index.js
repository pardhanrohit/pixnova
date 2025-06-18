const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Connect to MongoDB Atlas
mongoose.connect(
  'mongodb+srv://pardhanrohit3656:Rohit00pal@pixnovadb.dvjvyr0.mongodb.net/pixnova?retryWrites=true&w=majority&appName=PixnovaDB',
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// 📦 Order Schema
const orderSchema = new mongoose.Schema({
  name: String,
  email: String,
  number: String,
  items: String,
  date: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// 📬 POST API
app.post('/api/order', async (req, res) => {
  const { name, email, number, items } = req.body;

  if (!name || !email || !number || !items) {
    return res.status(400).json({ message: '❌ Please provide name, email, number, and items.' });
  }

  try {
    const newOrder = new Order({ name, email, number, items });
    await newOrder.save();
    console.log('🧾 Order stored:', newOrder);
    res.status(200).json({ message: '✅ Order saved to database!', order: newOrder });
  } catch (err) {
    console.error('❌ Error saving order:', err.message);
    res.status(500).json({ message: 'Server error. Could not save order.', error: err.message });
  }
});

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
