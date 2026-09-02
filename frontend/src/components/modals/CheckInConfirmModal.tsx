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
      title="Confirm Check-in"
      description={`You will spend ${creditPrice} credits to access ${gymName}.`}
      confirmText={isLoading ? "Processing Check-in..." : "Continue"}
      cancelText="Cancel"
      onConfirm={onConfirm}
      onCancel={onCancel}
      isLoading={isLoading}
    />
  );
};

export default CheckInConfirmModal;
