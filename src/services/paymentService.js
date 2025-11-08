const API_URL = 'http://localhost:5000/api/payment';

export async function createMidtransTransaction(bookingData) {
  try {
    console.log('Creating Midtrans transaction:', bookingData);
    
    const response = await fetch(`${API_URL}/create-transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: bookingData.bookingCode,
        amount: bookingData.totalPrice,
        customerDetails: {
          first_name: bookingData.name,
          email: bookingData.email,
          phone: bookingData.phone,
        },
        itemDetails: [
          {
            id: bookingData.bikeId.toString(),
            price: bookingData.totalPrice,
            quantity: 1,
            name: `Sewa ${bookingData.bikeName} - ${bookingData.duration} jam`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create transaction');
    }

    const data = await response.json();
    console.log('Transaction created:', data);
    return data;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
}

export async function checkPaymentStatus(orderId) {
  try {
    console.log('Checking payment status for:', orderId);
    
    const response = await fetch(`${API_URL}/status/${orderId}`);
    
    if (!response.ok) {
      throw new Error('Failed to check payment status');
    }
    
    const data = await response.json();
    console.log('Payment status:', data);
    return data;
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw error;
  }
}

export async function pollPaymentStatus(orderId, onStatusChange, maxAttempts = 30) {
  let attempts = 0;
  
  const poll = async () => {
    try {
      const status = await checkPaymentStatus(orderId);
      onStatusChange(status);
      
      if (status.status === 'success' || status.status === 'failed') {
        return status;
      }
      
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(poll, 2000); // Check setiap 2 detik
      }
    } catch (error) {
      console.error('Polling error:', error);
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(poll, 2000);
      }
    }
  };
  
  poll();
}