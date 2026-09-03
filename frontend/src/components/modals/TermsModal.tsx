import React from 'react';
import Button from '../ui/Button';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="bg-black/80 backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 w-full max-w-lg rounded-2xl flex flex-col max-h-[80vh] border border-zinc-800">
        <h2 className="text-white font-bold border-b border-zinc-800 pb-4 m-6 mb-0 text-xl">
          RoamFit Terms & Conditions
        </h2>
        
        <div className="overflow-y-auto p-6 text-sm text-zinc-400 space-y-4">
          <p>
            1. <strong>Pay-per-visit System:</strong> The RoamFit ecosystem operates using a pay-per-visit concept with a digital currency in the form of wallet credits. Each workout session at a partner gym will deduct your credit balance according to the price set by the respective gym.
          </p>
          <p>
            2. <strong>Credit Deduction Rules:</strong> Your credits will be immediately deducted as soon as you press the check-in button. The credit balance will be considered forfeited even if your check-in PIN expires or you do not validate the PIN at the partner gym location. Please only check-in when you are ready to enter.
          </p>
          <p>
            3. <strong>Gym Partner Rules of Conduct:</strong> As a RoamFit member, you are required to comply with all rules and regulations applicable at every partner gym location you visit. Any form of violation may result in temporary to permanent revocation of access to the RoamFit platform.
          </p>
          <p>
            4. <strong>Non-refundable Policy:</strong> All credit balances that have been purchased or topped up are final and non-refundable (cannot be cashed back into your bank account). Ensure that you top up your balance according to your workout needs.
          </p>
        </div>

        <div className="p-6 pt-0 mt-auto">
          <Button variant="primary" className="w-full py-3" onClick={onClose}>
            Understand & Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
