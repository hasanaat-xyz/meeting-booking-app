# Meeting Booking App

A full-stack appointment scheduling application that allows hosts to manage their available time slots and enables clients to book meetings.

## Features

### ✅ Availability Management (Host View)
- Calendar-based user interface to select specific dates and times
- Add, update, and remove available meeting time slots
- View all scheduled slots with booking status
- Dashboard to manage all your time slots

### ✅ Public Booking Page (Client View)
- Public calendar link to view available time slots
- View available slots grouped by day and month
- Only available (non-booked) slots are visible for booking
- Beautiful, modern UI with responsive design

### ✅ Meeting Request & Booking
- Select an available time slot
- Submit meeting request with:
  - Name
  - Email
  - Purpose of the meeting
- Real-time validation and error handling

### ✅ Email Notification
- Host receives email notification when a meeting is booked
- Email includes all meeting details (client name, email, purpose, date, time)
- Professional HTML email templates

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **Nodemailer** with Resend for email notifications
- **JWT** for authentication
- **Google Calendar API** integration (optional)

### Frontend
- **React** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- Resend API key for email notifications

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
MONGO_URI=your_mongodb_connection_string
PORT=8000
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=your_verified_email@domain.com
JWT_SECRET=your_jwt_secret_key
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

### For Hosts

1. **Register/Login**: Create an account or login at `/register` or `/login`
2. **Access Dashboard**: Navigate to `/dashboard` to manage your slots
3. **Add Slots**: Select a date, start time, and end time, then click "Add Slot"
4. **Manage Slots**: Update or delete slots (only available slots can be modified)
5. **Receive Notifications**: You'll receive an email when someone books your slot

### For Clients

1. **View Available Slots**: Visit the public booking page (root route `/`)
2. **Select a Slot**: Click on an available time slot
3. **Fill Details**: Enter your name, email, and meeting purpose
4. **Book Meeting**: Click "Book Meeting Slot" to confirm
5. **Confirmation**: You'll see a success message confirming your booking

## API Endpoints

### Slots
- `GET /api/slots/all` - Get all available (public) slots
- `GET /api/slots` - Get authenticated user's slots (requires auth)
- `POST /api/slots/create` - Create a new slot (requires auth)
- `PUT /api/slots/:id` - Update a slot (requires auth)
- `DELETE /api/slots/:id` - Delete a slot (requires auth)

### Bookings
- `POST /api/event/book` - Create a booking (public)
  - Body: `{ slotId, name, email, purpose }`

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user

## Environment Variables

Make sure to set up the following environment variables in your `.env` file:

- `MONGO_URI`: MongoDB connection string
- `PORT`: Server port (default: 8000)
- `RESEND_API_KEY`: Resend API key for sending emails
- `FROM_EMAIL`: Verified email address for sending notifications
- `JWT_SECRET`: Secret key for JWT token generation

## Project Structure

```
meeting-booking-app/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   ├── utils/          # Utilities (email, etc.)
│   │   └── config/         # Configuration files
│   └── server.js           # Server entry point
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── App.jsx         # Main app component
│   └── vite.config.js      # Vite configuration
└── README.md
```

## Features Implemented

✅ Calendar-based slot management  
✅ Add, update, delete slots  
✅ Public booking page with calendar view  
✅ Slot booking with client details  
✅ Email notifications to host  
✅ Real-time slot availability  
✅ Responsive design  
✅ Form validation  
✅ Error handling  

## License

MIT