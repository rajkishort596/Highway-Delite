# 🛣️ Highway Delite Assignment

A full-stack web application built for the **Highway Delite Assignment** that allows users to explore experiences, view available time slots, and make bookings.  
The project includes a scalable backend (Node.js + Express + MongoDB) and a modern frontend (React + TypeScript + Tailwind CSS).

---

## 🚀 Features

### Backend (Node.js + Express + MongoDB)

- API to list experiences
- Fetch experience details with dynamic slot availability
- Book slots with validation and capacity checks
- Apply promo codes (`SAVE10`, `FLAT100`)
- Automatic future slot generation (daily cron job)
- MongoDB schema design for scalability

### Frontend (React + TypeScript + Tailwind CSS)

- Displays experiences in responsive card layout
- Lazy-loaded images with blur effect
- Detailed experience page with available slots
- Date and time slot selection
- Quantity-based price calculation with tax
- Dynamic booking summary

---

## 🧠 Tech Stack

**Backend:**

- Node.js
- Express.js
- MongoDB + Mongoose
- Node-cron
- dotenv
- CORS

**Frontend:**

- React (Vite + TypeScript)
- Tailwind CSS
- React Router DOM
- React Lazy Load Image Component
- Axios

---

## 🗂️ Folder Structure

```
Highway-Delite/
│
├── server/
│   ├── src/
│   │   ├── models/
│   │   │   ├── experience.model.js
│   │   │   ├── slot.model.js
│   │   │   └── booking.model.js
│   │   ├── controllers/
│   │   │   ├── experience.controller.js
│   │   │   ├── booking.controller.js
│   │   │   └── promo.controller.js
│   │   ├── routes/
│   │   │   ├── experience.routes.js
│   │   │   ├── booking.routes.js
│   │   │   └── promo.routes.js
│   │   ├── services/
│   │   │   └── generateSlots.service.js
│   │   ├── db/
│   │   │   └── index.js
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   ├── ApiResponse.js
│   │   │   └── AsyncHandler.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   ├── experience.Api.ts
│   │   │   └── booking.Api.ts
│   │   │   └── promo.Api.ts
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── ExperienceCard.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── Container.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   └── Details.tsx
│   │   │   └── Checkout.tsx
│   │   │   └── Result.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Environment Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/rajkishort596/Highway-Delite.git
cd Highway-Delite
```

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create a **.env** file inside `backend/`:

```bash
PORT=8000
MONGODB_URI=mongodb://localhost:27017/highwaydelite
CORS_ORIGIN=http://localhost:5173
```

Run the backend server:

```bash
npm run dev
```

Server will start on `http://localhost:8000`

---

### 3️⃣ Frontend Setup

```bash
cd client
npm install
```

Run the frontend:

```bash
npm run dev
```

Frontend will start on `http://localhost:5173`

---

## 🧩 API Endpoints

| Method   | Endpoint               | Description                                 |
| -------- | ---------------------- | ------------------------------------------- |
| **GET**  | `/api/experiences`     | Get all experiences                         |
| **GET**  | `/api/experiences/:id` | Get experience details with available slots |
| **POST** | `/api/bookings`        | Create a booking                            |
| **POST** | `/api/promo/validate`  | Validate promo code                         |

---

## 🔁 Slot Generation

- The backend automatically generates **future slots (30 days)** using a daily cron job.
- Each experience can have:
  - `frequency`: daily / weekends / custom
  - `times`: list of time slots
  - `capacityPerSlot`: max users per slot

---

## 💡 Key Highlights

- Scalable MongoDB schema design
- Dynamic slot fetching based on frequency
- Booking with transaction safety
- Lazy-loaded frontend images for better performance
- Clean modular folder structure

---

## 🧑‍💻 Author

**Rajkishor Thakur**

---

## ✅ License

This project was created as part of the **Highway Delite Internship Assignment**.  
It is for demonstration and evaluation purposes only.
