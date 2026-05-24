export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Business {
  id: number;
  userId: number;
  name: string;
  businessType: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  logoUrl?: string;
  openingTime: string;
  closingTime: string;
  createdAt: string;
}

export interface Offer {
  id: number;
  businessId: number;
  businessName: string;
  businessType: string;
  businessCity: string;
  title: string;
  description: string;
  category: string;
  originalPrice: number;
  offerPrice: number;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  totalCapacity: number;
  maxBookingPerCustomer: number;
  termsAndConditions?: string;
  status: string;
  totalSlots: number;
  availableSlots: number;
  createdAt: string;
  updatedAt: string;
}

export interface OfferSlot {
  id: number;
  offerId: number;
  offerTitle: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  capacity: number;
  bookedCount: number;
  availableCount: number;
  status: string;
  createdAt: string;
}

export interface Booking {
  id: number;
  bookingReference: string;
  offerId: number;
  offerTitle: string;
  businessName: string;
  slotId: number;
  slotDate: string;
  slotStartTime: string;
  slotEndTime: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  peopleCount: number;
  specialNote?: string;
  status: string;
  createdAt: string;
}

export interface DashboardSummary {
  totalOffers: number;
  activeOffers: number;
  totalBookings: number;
  todaysBookings: number;
  totalCapacity: number;
  bookedSeats: number;
  availableSeats: number;
  conversionRate: number;
  recentBookings: RecentBooking[];
}

export interface RecentBooking {
  id: number;
  bookingReference: string;
  customerName: string;
  offerName: string;
  slotTime: string;
  peopleCount: number;
  status: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  name: string;
  email: string;
  role: string;
}
