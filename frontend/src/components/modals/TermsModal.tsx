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
          Syarat & Ketentuan RoamFit
        </h2>
        
        <div className="overflow-y-auto p-6 text-sm text-zinc-400 space-y-4">
          <p>
            1. <strong>Sistem Pay-per-visit:</strong> Ekosistem RoamFit beroperasi menggunakan konsep pay-per-visit dengan mata uang digital berupa kredit dompet. Setiap sesi latihan di gym mitra akan memotong saldo kredit Anda sesuai dengan harga yang ditetapkan oleh masing-masing gym.
          </p>
          <p>
            2. <strong>Aturan Pemotongan Kredit:</strong> Kredit Anda akan langsung terpotong begitu Anda menekan tombol check-in. Saldo kredit akan dianggap hangus meskipun PIN check-in Anda kedaluwarsa atau Anda tidak jadi memvalidasi PIN tersebut di lokasi gym mitra. Harap lakukan check-in hanya jika Anda sudah siap masuk.
          </p>
          <p>
            3. <strong>Tata Tertib Mitra Gym:</strong> Sebagai member RoamFit, Anda diwajibkan untuk mematuhi semua tata tertib dan peraturan yang berlaku di setiap lokasi gym mitra yang Anda kunjungi. Segala bentuk pelanggaran dapat mengakibatkan pencabutan akses sementara hingga permanen pada platform RoamFit.
          </p>
          <p>
            4. <strong>Kebijakan Non-refundable:</strong> Seluruh saldo kredit yang telah dibeli atau di-top up bersifat final dan non-refundable (tidak dapat diuangkan kembali ke rekening bank Anda). Pastikan Anda melakukan pengisian saldo sesuai dengan kebutuhan latihan Anda.
          </p>
        </div>

        <div className="p-6 pt-0 mt-auto">
          <Button variant="primary" className="w-full py-3" onClick={onClose}>
            Mengerti / Tutup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
