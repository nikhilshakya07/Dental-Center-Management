import React, { useState } from 'react';
import PatientList from '../components/patient/PatientList';
import PatientForm from '../components/patient/PatientForm';
import Modal from '../components/common/Modal';
import { usePatients } from '../contexts/PatientContext';

const Patients = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const { addPatient } = usePatients();

  const handleAddPatient = async (patientData) => {
    await addPatient(patientData);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          Add Patient
        </button>
      </div>

      <PatientList />

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Patient"
      >
        <PatientForm
          onSubmit={handleAddPatient}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Patients; 