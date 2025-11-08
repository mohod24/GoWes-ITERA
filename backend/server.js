const express = require('express');
const cors = require('cors');
const midtransClient = require('midtrans-client');
require('dotenv').config(); // Pastikan dotenv di-load

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Konfigurasi Midtrans
const snap = new midtransClient.Snap({
  isProduction: false, // Sandbox mode
  serverKey: process.env.MIDTRANS_SERVER_KEY, // Gunakan variabel lingkungan
  clientKey: process.env.MIDTRANS_CLIENT_KEY // Gunakan variabel lingkungan
});

// Endpoint: Create Transaction
app.post('/api/payment/create-transaction', async (req, res) => {
  try {
    const { orderId, amount, customerDetails, itemDetails } = req.body;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount
      },
      customer_details: customerDetails,
      item_details: itemDetails,
      callbacks: {
        finish: 'http://localhost:3000' // URL frontend Anda
      }
    };

    console.log('Creating transaction:', parameter);

    const transaction = await snap.createTransaction(parameter);
    
    res.json({
      success: true,
      token: transaction.token,
      redirect_url: transaction.redirect_url
    });

  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint: Check Payment Status
app.get('/api/payment/status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const statusResponse = await snap.transaction.status(orderId);
    
    res.json({
      success: true,
      status: statusResponse.transaction_status === 'settlement' ? 'success' : 
              statusResponse.transaction_status === 'pending' ? 'pending' : 'failed',
      transactionStatus: statusResponse.transaction_status,
      data: statusResponse
    });

  } catch (error) {
    console.error('Error checking status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Webhook untuk notifikasi dari Midtrans (optional tapi recommended)
app.post('/api/payment/notification', async (req, res) => {
  try {
    const statusResponse = await snap.transaction.notification(req.body);
    
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    
    console.log(`Transaction ${orderId} status: ${transactionStatus}`);
    
    // Update database Anda di sini
    // ...
    
    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ success: false });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
