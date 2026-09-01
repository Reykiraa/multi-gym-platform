import React from 'react';
import Button from '../ui/Button';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'tos' | 'pp' | null;
}

const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen || !type) return null;

  return (
    <div className="bg-black/80 backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 w-full max-w-3xl rounded-3xl flex flex-col max-h-[85vh] border border-zinc-800 shadow-2xl">
        <h2 className="text-white font-bold border-b border-zinc-800 pb-4 m-6 mb-0 text-xl md:text-2xl">
          {type === 'tos' ? 'Syarat dan Ketentuan (Terms of Service)' : 'Kebijakan Privasi (Privacy Policy)'}
        </h2>
        
        <div className="overflow-y-auto p-6 text-sm text-zinc-300 space-y-6">
          {type === 'tos' ? (
            <>
              <p className="text-zinc-400"><strong>Berlaku Efektif: 27 Agustus 2026</strong></p>
              <p>Selamat datang di RoamFit. Syarat dan Ketentuan ini ("Perjanjian") adalah perjanjian sah antara Anda ("Pengguna" atau "Member") dan pengelola platform RoamFit ("Kami"). Dengan mendaftar, mengakses, atau menggunakan layanan Kami, Anda menyatakan setuju untuk terikat dengan seluruh syarat dan ketentuan di bawah ini sesuai dengan hukum yang berlaku di Republik Indonesia (Pasal 1320 KUHPerdata tentang Syarat Sah Perjanjian).</p>

              <div>
                <h3 className="text-yellow-500 font-bold mb-2 text-base">1. Definisi</h3>
                <ul className="list-decimal list-inside space-y-1 text-zinc-400">
                  <li><strong>RoamFit</strong> adalah platform perantara digital yang memfasilitasi akses pay-per-visit ke berbagai fasilitas kebugaran.</li>
                  <li><strong>Mitra Gym</strong> adalah pihak ketiga (fasilitas kebugaran independen) yang bekerja sama dengan RoamFit untuk menerima kunjungan Pengguna.</li>
                  <li><strong>Kredit</strong> adalah satuan nilai tukar digital internal RoamFit yang digunakan untuk mengakses fasilitas Mitra Gym.</li>
                  <li><strong>PIN Check-in</strong> adalah kode unik sementara yang dihasilkan oleh sistem untuk memvalidasi akses Pengguna di lokasi Mitra Gym.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-yellow-500 font-bold mb-2 text-base">2. Layanan Ekosistem & Batasan Tanggung Jawab</h3>
                <ul className="list-decimal list-inside space-y-1 text-zinc-400">
                  <li>RoamFit murni bertindak sebagai <strong>penyedia platform teknologi perantara</strong>. Kami tidak memiliki, mengelola, atau mengontrol fasilitas fisik, peralatan, maupun staf di lokasi Mitra Gym.</li>
                  <li>Kami tidak bertanggung jawab atas cedera fisik, kecelakaan, kerugian materiil, atau kehilangan barang bawaan yang terjadi selama Pengguna berada di fasilitas Mitra Gym. Risiko penggunaan alat kebugaran sepenuhnya menjadi tanggung jawab Pengguna.</li>
                  <li>Pengguna wajib mematuhi seluruh tata tertib, jam operasional, dan standar berpakaian yang ditetapkan secara sepihak oleh masing-masing Mitra Gym.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-yellow-500 font-bold mb-2 text-base">3. Sistem Kredit, Top-Up, dan Kebijakan Non-Refundable</h3>
                <ul className="list-decimal list-inside space-y-1 text-zinc-400">
                  <li>Kredit RoamFit hanya dapat digunakan di dalam ekosistem platform Kami dan tidak memiliki nilai tunai (bukan uang elektronik sebagaimana diatur oleh Bank Indonesia).</li>
                  <li><strong>Kebijakan Non-Refundable:</strong> Seluruh transaksi pembelian Kredit yang telah berhasil bersifat final. Kredit tidak dapat ditukar kembali menjadi uang tunai, ditransfer ke akun bank, atau dikembalikan dalam bentuk apa pun.</li>
                  <li>Jika akun ditutup, baik atas permintaan Pengguna maupun akibat pelanggaran aturan, seluruh sisa Kredit akan hangus.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-yellow-500 font-bold mb-2 text-base">4. Aturan Check-in, PIN, dan Pemotongan Saldo</h3>
                <ul className="list-decimal list-inside space-y-1 text-zinc-400">
                  <li>Saat Pengguna menekan tombol "Check-in", sistem akan menahan (mengunci) Kredit sesuai dengan tarif Mitra Gym dan menghasilkan PIN Check-in.</li>
                  <li>PIN Check-in memiliki masa berlaku (Time-To-Live). Jika Pengguna gagal menunjukkan PIN kepada resepsionis Mitra Gym sebelum batas waktu berakhir, PIN akan kedaluwarsa secara otomatis dan saldo Kredit <strong>tidak jadi dipotong</strong> (dikembalikan penuh ke dompet Pengguna).</li>
                  <li>Saldo Kredit hanya akan dipotong secara permanen ketika Mitra Gym berhasil memvalidasi PIN tersebut di sistem mereka.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-yellow-500 font-bold mb-2 text-base">5. Penangguhan dan Pemutusan Akun</h3>
                <p className="text-zinc-400 mb-2">Kami berhak, atas kebijakan Kami sendiri, untuk membekukan atau menghapus akun Pengguna apabila ditemukan dugaan:</p>
                <ul className="list-decimal list-inside space-y-1 text-zinc-400">
                  <li>Penipuan, manipulasi sistem, atau rekayasa transaksi.</li>
                  <li>Pelanggaran tata tertib berat di fasilitas Mitra Gym (berdasarkan laporan Mitra).</li>
                  <li>Tindakan yang melanggar hukum positif Republik Indonesia.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-yellow-500 font-bold mb-2 text-base">6. Penyelesaian Sengketa</h3>
                <p className="text-zinc-400">Segala perselisihan yang timbul dari Perjanjian ini akan diselesaikan secara musyawarah untuk mufakat. Apabila tidak tercapai mufakat dalam waktu 30 hari, maka kedua belah pihak sepakat untuk menyelesaikannya melalui yurisdiksi non-eksklusif Pengadilan Negeri tempat domisili hukum RoamFit berada.</p>
              </div>
            </>
          ) : (
            <>
              <p className="text-zinc-400"><strong>Berlaku Efektif: 27 Agustus 2026</strong></p>
              <p>RoamFit ("Kami") sangat menghargai dan melindungi privasi data Anda. Kebijakan Privasi ini menjelaskan bagaimana Kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pribadi Anda sesuai dengan <strong>Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)</strong> Republik Indonesia.</p>

              <div>
                <h3 className="text-yellow-500 font-bold mb-2 text-base">1. Data yang Kami Kumpulkan</h3>
                <p className="text-zinc-400 mb-2">Saat Anda menggunakan aplikasi Kami, Kami mengumpulkan Data Pribadi Spesifik dan Umum, termasuk namun tidak terbatas pada:</p>
                <ul className="list-disc list-inside space-y-1 text-zinc-400">
                  <li><strong>Data Identitas:</strong> Nama lengkap, alamat email, dan kata sandi (disimpan dalam format terenkripsi/hash).</li>
                  <li><strong>Data Transaksi:</strong> Riwayat mutasi Kredit, histori fasilitas Gym yang dikunjungi, dan waktu check-in/checkout.</li>
                  <li><strong>Data Teknis:</strong> Informasi perangkat, alamat IP, dan cookies (jika diakses melalui peramban web) untuk keperluan kelancaran sesi (session maintenance).</li>
                </ul>
              </div>

              <div>
                <h3 className="text-yellow-500 font-bold mb-2 text-base">2. Tujuan Penggunaan Data</h3>
                <p className="text-zinc-400 mb-2">Kami menggunakan Data Pribadi Anda secara eksklusif untuk:</p>
                <ul className="list-decimal list-inside space-y-1 text-zinc-400">
                  <li>Memproses pembuatan dan pengelolaan akun RoamFit Anda.</li>
                  <li>Memfasilitasi transaksi pemotongan Kredit dan penerbitan PIN.</li>
                  <li>Memberikan dukungan pelanggan (customer support).</li>
                  <li>Melakukan audit internal untuk mencegah tindakan penipuan (fraud detection).</li>
                </ul>
              </div>

              <div>
                <h3 className="text-yellow-500 font-bold mb-2 text-base">3. Berbagi Data dengan Pihak Ketiga (Mitra Gym)</h3>
                <p className="text-zinc-400 mb-2">Kami <strong>tidak akan pernah memperjualbelikan</strong> Data Pribadi Anda kepada pihak ketiga mana pun. Namun, demi kelancaran operasional layanan, Kami akan membagikan sebagian data Anda (secara terbatas) kepada Mitra Gym, yaitu berupa:</p>
                <ul className="list-disc list-inside space-y-1 text-zinc-400">
                  <li>Nama Profil Anda.</li>
                  <li>Status Validasi PIN dan Waktu Kunjungan.</li>
                </ul>
                <p className="text-zinc-400 mt-2">Hal ini mutlak diperlukan agar resepsionis Mitra Gym dapat memverifikasi identitas Anda saat Anda tiba di lokasi.</p>
              </div>

              <div>
                <h3 className="text-yellow-500 font-bold mb-2 text-base">4. Keamanan dan Retensi Data</h3>
                <ul className="list-decimal list-inside space-y-1 text-zinc-400">
                  <li>Kami melindungi Data Pribadi Anda menggunakan standar enkripsi industri untuk pertukaran data (HTTPS/SSL) dan mekanisme tokenisasi otentikasi (seperti Bearer Token).</li>
                  <li>Data sandi (password) dienkripsi menggunakan algoritma hashing satu arah; staf Kami tidak memiliki akses untuk melihat kata sandi asli Anda.</li>
                  <li>Kami akan menyimpan Data Pribadi Anda selama akun Anda aktif, atau selama diperlukan untuk memenuhi kewajiban hukum, perpajakan, atau penyelesaian sengketa di Indonesia.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-yellow-500 font-bold mb-2 text-base">5. Hak Anda (Subjek Data)</h3>
                <p className="text-zinc-400 mb-2">Sesuai dengan UU PDP, Anda memiliki hak penuh untuk:</p>
                <ul className="list-decimal list-inside space-y-1 text-zinc-400">
                  <li>Meminta akses terhadap Data Pribadi Anda yang Kami simpan.</li>
                  <li>Meminta perbaikan (update) jika terdapat data yang tidak akurat (melalui menu "Edit Profile").</li>
                  <li>Meminta penghapusan Data Pribadi Anda secara permanen dari sistem Kami (Hak untuk Dilupakan / Right to be Erasure), dengan catatan sisa saldo Kredit akan hangus.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-yellow-500 font-bold mb-2 text-base">6. Perubahan Kebijakan & Kontak</h3>
                <p className="text-zinc-400 mb-2">Kami berhak memperbarui Kebijakan Privasi ini dari waktu ke waktu. Jika ada perubahan material, Kami akan memberitahukan Anda melalui email atau notifikasi aplikasi.</p>
                <p className="text-zinc-400">Untuk pertanyaan, keluhan, atau pelaksanaan Hak Subjek Data, Anda dapat menghubungi Data Protection Officer (DPO) / Tim Admin Kami melalui email: <strong>privacy@roamfit.com</strong> atau fitur "Hubungi Kami" di aplikasi.</p>
              </div>
            </>
          )}
        </div>

        <div className="p-6 pt-0 mt-auto border-t border-zinc-800 mt-4 pt-6">
          <Button variant="primary" className="w-full py-4 text-sm font-bold uppercase tracking-widest" onClick={onClose}>
            Mengerti & Tutup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
