# Dental Center Dashboard

A modern, responsive web application for managing a dental practice. Built with React, TailwindCSS, and modern web technologies.

## Features

- 🔐 **User Authentication**
  - Secure login/logout
  - Role-based access control (Admin/Patient)
  - Protected routes and authorized actions

- 👥 **Patient Management**
  - Complete patient records
  - Medical history tracking
  - Emergency contact information
  - Admin-only access for patient data

- 📅 **Appointment System**
  - Interactive calendar view
  - Treatment notes and history
  - File attachments support (images/PDFs)
  - Next appointment scheduling
  - Email notifications (coming soon)

- 📊 **Dashboard & Analytics**
  - Role-specific KPIs
  - Appointment statistics
  - Revenue tracking (admin)
  - Treatment history (patients)

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
   VITE_API_URL=your_api_url
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

1. Calendar week view implementation pending
2. File preview not supported for all PDF versions
3. Performance optimization needed for large patient lists
4. Mobile calendar view needs refinement

## Future Enhancements

1. Email notifications for appointments
2. Integration with dental imaging systems
3. Patient portal for medical history updates
4. Advanced reporting and analytics
5. Multi-language support

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
