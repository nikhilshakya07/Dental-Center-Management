# Dental Center Dashboard

A fully responsive frontend dashboard for managing a dental clinic's appointments, patients, and treatment records. Built with React, TailwindCSS, and modern web technologies.

![Denter Center Screenshot](public/Screenshot%202025-07-06%20154906.png)

## 🔗 Live Demo

[ Live Application ](https://dental-center-management-pi.vercel.app)  

[ GitHub Repository](https://github.com/nikhilshakya07/Dental-Center-Management)


## Features

### 👨‍⚕️ Admin (Dentist)
  - Secure login (simulated with hardcoded credentials)
  - View, add, edit, delete patients
  - Manage appointments (incidents) with cost, treatment details, status, next appointment
  - Upload treatment files (PDFs, images)
  - View upcoming appointments in a calendar (monthly/weekly)
  - Admin dashboard with KPIs (pending/completed treatments, revenue, top patients, etc.)

### 👤 Patient
  - Login (simulated)
  - View their own appointment history and upcoming visits
  - Access cost, treatment details, and uploaded files

### 🔐 User Authentication
  - Secure login/logout
  - Role-based access control (Admin/Patient)
  - Protected routes and authorized actions

### 👥 Patient Management
  - Complete patient records
  - Medical history tracking
  - Emergency contact information
  - Admin-only access for patient data

### 📅 Appointment System
  - Interactive calendar view
  - Treatment notes and history
  - File attachments support (images/PDFs)
  - Next appointment scheduling
  - Email notifications (coming soon)

### 📊 Dashboard & Analytics
  - Role-specific KPIs
  - Appointment statistics
  - Revenue tracking (admin)
  - Treatment history (patients)

## 🧠 Tech Stack
  - **React.js** (functional components + hooks)
  - **React Router DOM**
  - **Context API** for global state management
  - **Tailwind CSS v4** for modern styling
  - **LocalStorage** (custom utility + hooks)
  - **No backend/API** – everything simulated
  - **File uploads** via Base64 / Blob URLs

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Modern web browser

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nikhilshakya07/Dental-Center-Management.git
   cd Dental-Center-Management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   VITE_STORAGE_KEY=your_storage_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Architecture

### Frontend Structure

```
src/
├── components/        # Reusable UI components
│   ├── appointment/  # Appointment-related components
│   ├── auth/        # Authentication components
│   ├── common/      # Shared components
│   ├── dashboard/   # Dashboard components
│   └── patient/     # Patient management components
├── contexts/         # React Context providers
├── hooks/           # Custom React hooks
├── pages/           # Main route components
└── utils/           # Helper functions
```

### Key Technologies

- **React**: Frontend library
- **TailwindCSS**: Utility-first CSS framework
- **date-fns**: Date manipulation
- **Vite**: Build tool and dev server

## Security

- All sensitive data is encrypted before storage
- File uploads are validated for type and size
- Session management with secure tokens
- XSS protection through React's built-in escaping
- CSRF protection implemented

## Known Issues

1. File preview not supported after uploading the file
2. Performance optimization needed for large patient lists
3. Mobile calendar view needs refinement

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email nikhilshakya1308@gmail.com or open an issue in the repository.

## Developed By

**Nikhil Shakya**

**GitHub**: https://github.com/nikhilshakya07

**LinkedIn**: https://www.linkedin.com/in/nikhil-shakya07/