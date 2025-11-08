import React, { useState, useEffect } from "react";
import { CreditCard, Clock, ArrowLeft, Loader, CheckCircle, XCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import { formatRupiah } from "../utils/paymentCalculator";
import { createMidtransTransaction, checkPaymentStatus } from "../services/paymentService";

export default function PaymentPage({
  booking,
  currentUser,
  setPage,
  logout,
  handlePaymentSuccess,
  showSuccess,
  showError,
  showWarning,
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('waiting'); // waiting, processing, success, failed
  const [countdown, setCountdown] = useState(900); // 15 menit

  useEffect(() => {
    if (countdown > 0 && paymentStatus === 'waiting') {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, paymentStatus]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePayment = async () => {
  setIsProcessing(true);
  setPaymentStatus('processing');
  
  // CEK SNAP TERSEDIA
  if (!window.snap) {
    console.error('❌ Midtrans Snap not loaded!');
    showError('Midtrans Snap belum dimuat. Silakan refresh halaman.');
    setIsProcessing(false);
    setPaymentStatus('waiting');
    return;
  }
  
  console.log('✅ Midtrans Snap loaded');
  
  try {
    console.log('📤 Creating transaction...');
    console.log('Booking data:', booking);
    
    // Create transaction & get Snap token
    const transaction = await createMidtransTransaction(booking);
    
    console.log('📥 Transaction response:', transaction);
    
    if (!transaction.success) {
      throw new Error(transaction.error || 'Gagal membuat transaksi');
    }
    
    if (!transaction.token) {
      throw new Error('Token tidak ditemukan dalam response');
    }

    console.log('🎫 Token received:', transaction.token);
    console.log('🚀 Opening Snap popup...');

    // Open Midtrans Snap popup
    window.snap.pay(transaction.token, {
      onSuccess: async function(result) {
        console.log('✅ Payment success:', result);
        setPaymentStatus('success');
        
        // Verify dari backend
        setTimeout(async () => {
          try {
            const status = await checkPaymentStatus(booking.bookingCode);
            
            if (status.success && (status.status === 'success' || status.transactionStatus === 'settlement')) {
              showSuccess('Pembayaran berhasil! Mengarahkan ke halaman pesanan...');
              setTimeout(() => {
                handlePaymentSuccess(booking.id);
              }, 2000);
            } else {
              // Polling status jika belum settlement
              pollStatus();
            }
          } catch (error) {
            console.error('Error verifying payment:', error);
            pollStatus();
          }
        }, 1000);
      },
      onPending: function(result) {
        console.log('⏳ Payment pending:', result);
        setPaymentStatus('processing');
        showWarning('Menunggu pembayaran. Silakan selesaikan pembayaran Anda.');
        setIsProcessing(false);
        
        // Poll status
        pollStatus();
      },
      onError: function(result) {
        console.log('❌ Payment error:', result);
        setPaymentStatus('failed');
        showError('Pembayaran gagal. Silakan coba lagi.');
        setIsProcessing(false);
      },
      onClose: function() {
        console.log('🚪 Payment popup closed');
        if (paymentStatus !== 'success') {
          setPaymentStatus('waiting');
          showWarning('Anda menutup jendela pembayaran. Klik tombol bayar untuk melanjutkan.');
        }
        setIsProcessing(false);
      }
    });
    
    } catch (error) {
      console.error('💥 Error:', error);
      showError('Terjadi kesalahan: ' + error.message);
      setPaymentStatus('waiting');
      setIsProcessing(false);
    }
  };

  const pollStatus = () => {
    let attempts = 0;
    const maxAttempts = 20;
    
    const checkStatus = async () => {
      try {
        const status = await checkPaymentStatus(booking.bookingCode);
        
        if (status.success) {
          if (status.status === 'success' || status.transactionStatus === 'settlement') {
            setPaymentStatus('success');
            showSuccess('Pembayaran berhasil diverifikasi!');
            setTimeout(() => {
              handlePaymentSuccess(booking.id);
            }, 2000);
            return;
          } else if (status.status === 'failed') {
            setPaymentStatus('failed');
            showError('Pembayaran gagal atau dibatalkan.');
            return;
          }
        }
        
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 3000);
        }
      } catch (error) {
        console.error('Error polling status:', error);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 3000);
        }
      }
    };
    
    checkStatus();
  };

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
        <Navbar page="payment" currentUser={currentUser} setPage={setPage} logout={logout} />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600">Booking tidak ditemukan.</p>
            <button
              onClick={() => setPage("myBookings")}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Kembali ke Pesanan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
      <Navbar page="payment" currentUser={currentUser} setPage={setPage} logout={logout} />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => setPage("myBookings")}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4 font-semibold"
        >
          <ArrowLeft size={20} />
          Kembali
        </button>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <h2 className="text-2xl font-bold text-gray-800">Pembayaran</h2>
            {paymentStatus === 'waiting' && (
              <div className="flex items-center gap-2 text-red-600">
                <Clock size={20} />
                <span className="font-mono font-bold">{formatTime(countdown)}</span>
              </div>
            )}
          </div>

          {/* Payment Status Indicator */}
          {paymentStatus === 'success' && (
            <div className="mb-6 bg-green-50 border-2 border-green-200 p-4 rounded-lg flex items-center gap-3">
              <CheckCircle size={24} className="text-green-600" />
              <div>
                <p className="font-semibold text-green-800">Pembayaran Berhasil!</p>
                <p className="text-sm text-green-600">Mengarahkan ke halaman pesanan...</p>
              </div>
            </div>
          )}

          {paymentStatus === 'processing' && (
            <div className="mb-6 bg-blue-50 border-2 border-blue-200 p-4 rounded-lg flex items-center gap-3">
              <Loader size={24} className="text-blue-600 animate-spin" />
              <div>
                <p className="font-semibold text-blue-800">Memproses Pembayaran...</p>
                <p className="text-sm text-blue-600">Mohon tunggu, sedang memverifikasi pembayaran Anda.</p>
              </div>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 p-4 rounded-lg flex items-center gap-3">
              <XCircle size={24} className="text-red-600" />
              <div>
                <p className="font-semibold text-red-800">Pembayaran Gagal</p>
                <p className="text-sm text-red-600">Silakan coba lagi atau gunakan metode pembayaran lain.</p>
              </div>
            </div>
          )}

          {/* Detail Booking */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">Detail Booking</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Kode Booking:</span>
                <span className="font-mono font-bold">{booking.bookingCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sepeda:</span>
                <span className="font-semibold">{booking.bikeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Durasi:</span>
                <span className="font-semibold">{booking.duration} jam</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Harga per jam:</span>
                <span className="font-semibold">{formatRupiah(10000)}</span>
              </div>
            </div>
          </div>

          {/* Total Pembayaran */}
          <div className="mb-6 bg-green-50 p-4 rounded-lg border-2 border-green-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-800">Total Pembayaran:</span>
              <span className="text-2xl font-bold text-green-600">
                {formatRupiah(booking.totalPrice)}
              </span>
            </div>
          </div>

          {/* Info Midtrans */}
          <div className="mb-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-sm text-blue-800 mb-2">
              <strong>💳 Metode Pembayaran Tersedia:</strong>
            </p>
            <ul className="text-xs text-blue-700 space-y-1 ml-4">
              <li>• QRIS (Semua E-Wallet & Mobile Banking)</li>
              <li>• E-Wallet: GoPay, ShopeePay, DANA, OVO</li>
              <li>• Virtual Account: BCA, BNI, BRI, Mandiri, Permata</li>
              <li>• Kartu Kredit/Debit (Visa, Mastercard, JCB)</li>
            </ul>
            <p className="text-xs text-blue-600 mt-2">
              ✅ Pembayaran diproses oleh <strong>Midtrans</strong> - Payment Gateway Terpercaya & Aman
            </p>
          </div>

          {/* Tombol Bayar */}
          <button
            onClick={handlePayment}
            disabled={isProcessing || paymentStatus === 'success'}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader size={20} className="animate-spin" />
                Membuka Halaman Pembayaran...
              </>
            ) : paymentStatus === 'success' ? (
              <>
                <CheckCircle size={20} />
                Pembayaran Berhasil
              </>
            ) : (
              <>
                <CreditCard size={20} />
                Bayar Sekarang
              </>
            )}
          </button>

          <div className="mt-4 flex items-center justify-center gap-2">
            <img 
              src="https://midtrans.com/assets/images/logo/midtrans.svg" 
              alt="Midtrans" 
              className="h-6"
              onError={(e) => e.target.style.display = 'none'}
            />
            <p className="text-xs text-gray-500">
              Powered by <strong>Midtrans</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}