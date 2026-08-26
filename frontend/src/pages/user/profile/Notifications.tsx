import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Card from '../../../components/ui/Card';

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    emailAlerts: true,
    checkInReminders: true,
    promoOffers: false
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-zinc-800 bg-zinc-950 p-4 sticky top-0 z-50 flex items-center">
        <button onClick={() => navigate('/user/profile')} className="p-2 -ml-2 text-zinc-400 hover:text-white">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-white ml-2">Notifications</h1>
      </header>

      <main className="flex-grow container mx-auto max-w-xl px-4 py-8">
        <p className="text-zinc-400 mb-6">Atur preferensi notifikasi Anda untuk pengalaman terbaik.</p>
        
        <div className="flex flex-col gap-4">
          <Card className="flex items-center justify-between p-5">
            <div>
              <h3 className="font-bold text-white mb-1">Email Alerts</h3>
              <p className="text-sm text-zinc-500">Pemberitahuan aktivitas akun via Email.</p>
            </div>
            <button 
              onClick={() => toggle('emailAlerts')}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.emailAlerts ? 'bg-yellow-500' : 'bg-zinc-700'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.emailAlerts ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </Card>
          
          <Card className="flex items-center justify-between p-5">
            <div>
              <h3 className="font-bold text-white mb-1">Check-in Reminders</h3>
              <p className="text-sm text-zinc-500">Pengingat kedaluwarsa PIN gym.</p>
            </div>
            <button 
              onClick={() => toggle('checkInReminders')}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.checkInReminders ? 'bg-yellow-500' : 'bg-zinc-700'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.checkInReminders ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </Card>

          <Card className="flex items-center justify-between p-5">
            <div>
              <h3 className="font-bold text-white mb-1">Promo Offers</h3>
              <p className="text-sm text-zinc-500">Informasi diskon top up kredit.</p>
            </div>
            <button 
              onClick={() => toggle('promoOffers')}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.promoOffers ? 'bg-yellow-500' : 'bg-zinc-700'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.promoOffers ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Notifications;
