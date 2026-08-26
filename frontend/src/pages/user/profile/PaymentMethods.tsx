import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, Trash2 } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';

interface CardItem {
  id: number;
  type: string;
  last4: string;
}

const PaymentMethods: React.FC = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<CardItem[]>([
    { id: 1, type: "Visa", last4: "4242" }
  ]);

  const addCard = () => {
    const randomLast4 = Math.floor(1000 + Math.random() * 9000).toString();
    const newCard: CardItem = {
      id: Date.now(),
      type: Math.random() > 0.5 ? "Mastercard" : "Visa",
      last4: randomLast4
    };
    setCards([...cards, newCard]);
  };

  const removeCard = (id: number) => {
    setCards(cards.filter(card => card.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-zinc-800 bg-zinc-950 p-4 sticky top-0 z-50 flex items-center">
        <button onClick={() => navigate('/user/profile')} className="p-2 -ml-2 text-zinc-400 hover:text-white">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-white ml-2">Payment Methods</h1>
      </header>

      <main className="flex-grow container mx-auto max-w-xl px-4 py-8">
        <h2 className="text-zinc-400 mb-4">Metode Pembayaran Tersimpan</h2>
        
        {cards.length === 0 ? (
          <div className="text-center text-zinc-500 py-8 mb-6 border border-zinc-800 border-dashed rounded-2xl">
            Belum ada kartu.
          </div>
        ) : (
          <div className="flex flex-col gap-4 mb-6">
            {cards.map((card, index) => (
              <Card key={card.id} className="flex items-center p-4 border border-yellow-500/30 bg-zinc-900/50">
                <div className="p-3 bg-zinc-800 rounded-lg mr-4 text-yellow-500">
                  <CreditCard size={24} />
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-white">{card.type}</h3>
                  <p className="text-sm text-zinc-500">Ending in ****{card.last4}</p>
                </div>
                {index === 0 && (
                  <span className="text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded mr-3">PRIMARY</span>
                )}
                <button 
                  onClick={() => removeCard(card.id)}
                  className="p-2 text-zinc-500 hover:text-rose-500 transition-colors bg-zinc-800/50 rounded-lg"
                  title="Remove card"
                >
                  <Trash2 size={18} />
                </button>
              </Card>
            ))}
          </div>
        )}

        <Button 
          variant="outline" 
          className="w-full py-4 border-dashed border-zinc-700 hover:border-yellow-500 hover:text-yellow-500 transition-colors"
          onClick={addCard}
        >
          + Add New Card
        </Button>
      </main>
    </div>
  );
};

export default PaymentMethods;
