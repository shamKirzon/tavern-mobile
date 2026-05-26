# 🍻 Tav — Restobar Management System

> A full-stack reservation and order management system built for **Tavern Asia Resto Bar**, Parañaque City. Designed to modernize operations by moving from walk-in to a reservation-only model, with QR-based verification and real-time order tracking.

---

## 📱 Mobile App — `tavern-mobile`

The mobile application is used by **customers** to make reservations, browse the menu, place orders, and receive a QR code for entry and cashier verification.

---

### Features

- **Email OTP Verification** — Customers verify their identity via a one-time passcode sent to their email before proceeding
- **Make a Reservation** — Select reservation type, preferred date, number of pax, and enter personal details (name, contact number, valid ID)
- **Browse Menu** — View food and drink items organized by category with prices and availability
- **Place Orders** — Add or remove items from cart, view running totals, and confirm an order summary before submitting
- **Payment Submission** — Upload a screenshot of the reservation deposit as proof; admin reviews and approves or declines manually
- **Reservation Status Tracking** — Real-time status updates: Pending, Confirmed, Declined, or Cancelled
- **QR Code Generation** — Receive a unique encrypted QR code after reservation and order confirmation, used for entry and cashier processing

---

### Tech Stack

| Tool | Purpose |
|---|---|
| React Native | Core mobile framework |
| Expo | Development and build tooling |
| Expo Go | Live preview during development |
| TypeScript | Type-safe JavaScript |
| Supabase | Auth, database, storage, and realtime |
| Postman | API testing |

---

### Getting Started

```bash
# Clone the repo
git clone https://github.com/shamKirzon/tavern-mobile.git
cd tavern-mobile

# Install dependencies
npm install

# Start the development server
npx expo start
```

Scan the QR code in the terminal using **Expo Go** on your iOS or Android device.


---

## 🗂️ System Overview

```
Customer (Mobile App)
  └── Register / Verify Email
  └── Make Reservation → Upload Payment Proof
  └── Place Order → Receive QR Code
  └── Present QR at Entrance & Cashier Counter
```


This project was developed as an academic requirement. All rights reserved by the authors and Tavern Asia Resto Bar.
