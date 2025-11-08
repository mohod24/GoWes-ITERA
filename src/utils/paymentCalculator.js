// Harga per jam
const BASE_PRICE_PER_HOUR = 10000;
const LATE_FEE_PER_HOUR = 5000;

export function calculateBookingPrice(duration) {
  return duration * BASE_PRICE_PER_HOUR;
}

export function calculateLateFee(bookedDuration, actualDuration) {
  if (actualDuration <= bookedDuration) return 0;
  const lateDuration = actualDuration - bookedDuration;
  return lateDuration * LATE_FEE_PER_HOUR;
}

export function calculateTotalPrice(bookedDuration, actualDuration = null) {
  const basePrice = calculateBookingPrice(bookedDuration);
  
  if (actualDuration && actualDuration > bookedDuration) {
    const lateFee = calculateLateFee(bookedDuration, actualDuration);
    return {
      basePrice,
      lateFee,
      totalPrice: basePrice + lateFee,
      isLate: true,
    };
  }
  
  return {
    basePrice,
    lateFee: 0,
    totalPrice: basePrice,
    isLate: false,
  };
}

export function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

// Hitung durasi aktual dalam jam (pembulatan ke atas)
export function calculateActualDuration(checkInDate) {
  const checkIn = new Date(checkInDate);
  const now = new Date();
  const diffMs = now - checkIn;
  const diffHours = diffMs / (1000 * 60 * 60);
  return Math.ceil(diffHours); // Bulatkan ke atas
}