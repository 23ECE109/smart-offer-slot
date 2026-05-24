# Smart Offer Slot Booking System

A web app where businesses can post limited-time offers and customers can book slots for those offers. Built for the Willovate Hackathon 2026.

---

## What this project does

Businesses like gyms, salons, restaurants, clinics and turfs can create offers with specific time slots. Customers can browse those offers and book a slot directly from the public page. The admin can manage everything from the dashboard.


---

## Tech used

- Frontend - React with TypeScript, Tailwind CSS, Vite
- Backend - .NET 8 Web API with C#
- Database - MySQL
- Auth - JWT tokens
- API docs - Swagger

---

## How to run this project

### What you need first
- .NET 8 SDK
- Node.js 18 or above
- MySQL running locally

### Backend

1. Go to the backend folder
```
cd SmartOfferSlot/backend/SmartOfferSlot.API
```

2. Open appsettings.json and update the connection string with your MySQL password
```
"DefaultConnection": "Server=localhost;Port=3306;Database=SmartOfferSlotDb;User=root;Password=yourpassword;"
```

3. Run migrations and start
```
dotnet ef database update
dotnet run
```

API will run at http://localhost:5000  
Swagger docs at http://localhost:5000/swagger

### Frontend

1. Go to frontend folder
```
cd SmartOfferSlot/frontend
```

2. Install packages
```
npm install
```

3. Start
```
npm run dev
```

App will open at http://localhost:5173

---

## Login

You can register your own account from the signup page.

---

## Pages

**Customer side**
- Home - choose customer or admin
- Offer listing - browse all active offers with filters
- Offer detail - full info, slot selection, booking form
- Booking confirmation - shows booking reference and QR code

**Admin side**
- Login / Signup
- Dashboard - stats and recent bookings
- Business Profile - create and edit business info
- Manage Offers - create, edit, change status
- Manage Slots - add time slots to offers
- Manage Bookings - view all bookings, update status, export CSV

---

## Features built

- Admin login and signup with JWT auth
- Create and manage offers with discount calculation
- Time slot management per offer
- Public booking flow with validation
- Booking confirmation with QR code
- Countdown timer on offer cards
- Dashboard with live stats
- Export bookings as CSV
- Dark and light mode toggle
- Filters on public page - business type, category, price range
- Responsive design

---

## Folder structure

```
SmartOfferSlot/
  backend/
    SmartOfferSlot.API/
      Controllers/
      Models/
      DTOs/
      Data/
      Services/
      Migrations/
  frontend/
    src/
      pages/
        admin/
        public/
      components/
      services/
      context/
      types/
```

---
