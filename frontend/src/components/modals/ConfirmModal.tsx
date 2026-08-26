import React from 'react';
import Button from '../ui/Button';

export interface ConfirmModalProps {
  /**
   * Controls whether the modal is visible
   */
  isOpen: boolean;
  /**
   * Title of the confirmation modal
   */
  title: string;
  /**
   * Description message in the modal
   */
  description: string;
  /**
   * Text for the confirm button
   */
  confirmText?: string;
  /**
   * Text for the cancel button
   */
  cancelText?: string;
  /**
   * Callback when confirm button is clicked
   */
  onConfirm: () => void;
  /**
   * Callback when cancel button or overlay is clicked
   */
  onCancel: () => void;
  /**
   * Optional loading state for the confirm button
   */
  isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-zinc-900 p-6 rounded-2xl max-w-sm w-full shadow-2xl border border-zinc-800 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-zinc-400 mb-6 text-sm">{description}</p>
        
        <div className="flex gap-3 w-full">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button 
            variant="primary" 
            className="flex-1" 
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
