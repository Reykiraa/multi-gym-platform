import React from 'react';
import ConfirmModal from './ConfirmModal';

interface CheckInConfirmModalProps {
  isOpen: boolean;
  gymName: string;
  creditPrice: number;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const CheckInConfirmModal: React.FC<CheckInConfirmModalProps> = ({
  isOpen,
  gymName,
  creditPrice,
  isLoading,
  onConfirm,
  onCancel
}) => {
  return (
    <ConfirmModal
      isOpen={isOpen}
      title="Konfirmasi Check-in"
      description={`Anda akan memotong ${creditPrice} kredit untuk mengakses ${gymName}.`}
      confirmText={isLoading ? "Memproses Check-in..." : "Lanjutkan"}
      cancelText="Batal"
      onConfirm={onConfirm}
      onCancel={onCancel}
      isLoading={isLoading}
    />
  );
};

export default CheckInConfirmModal;
