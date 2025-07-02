export const initialData = {
    users: [
      { 
        id: "1", 
        role: "Admin", 
        email: "admin@entnt.in", 
        password: "admin123",
        name: "Dr. Smith"
      },
      { 
        id: "2", 
        role: "Patient", 
        email: "john@entnt.in", 
        password: "patient123", 
        patientId: "p1",
        name: "John Doe"
      },
      { 
        id: "3", 
        role: "Patient", 
        email: "jane@entnt.in", 
        password: "patient123", 
        patientId: "p2",
        name: "Jane Smith"
      }
    ],
    patients: [
      {
        id: "p1",
        name: "John Doe",
        email: "john@entnt.in",
        dob: "1990-05-10",
        contact: "1234567890",
        address: "123 Main St, City",
        healthInfo: "No known allergies",
        emergencyContact: "9876543210",
        createdAt: "2024-01-15T10:00:00Z"
      },
      {
        id: "p2",
        name: "Jane Smith",
        email: "jane@entnt.in",
        dob: "1985-08-22",
        contact: "2345678901",
        address: "456 Oak Ave, City",
        healthInfo: "Allergic to penicillin",
        emergencyContact: "8765432109",
        createdAt: "2024-02-20T14:30:00Z"
      }
    ],
    appointments: [
      {
        id: "a1",
        patientId: "p1",
        title: "Routine Checkup",
        description: "Regular dental checkup and cleaning",
        comments: "Patient reports sensitivity",
        appointmentDate: "2025-07-15T10:00:00Z",
        status: "Scheduled",
        cost: 120,
        treatment: "",
        nextAppointment: "",
        files: [],
        createdAt: "2024-06-20T09:00:00Z"
      },
      {
        id: "a2",
        patientId: "p1",
        title: "Toothache Treatment",
        description: "Upper molar pain treatment",
        comments: "Sensitive to cold drinks",
        appointmentDate: "2025-06-28T14:00:00Z",
        status: "Completed",
        cost: 250,
        treatment: "Root canal therapy completed",
        nextAppointment: "2025-08-15T10:00:00Z",
        files: [
          { 
            id: "f1",
            name: "xray_report.pdf", 
            type: "application/pdf",
            size: 2048,
            url: "data:application/pdf;base64,sample-base64-string"
          }
        ],
        createdAt: "2024-06-15T11:00:00Z"
      }
    ]
  };