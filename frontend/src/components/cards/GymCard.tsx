import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { type Gym } from '../../types';

export interface GymCardProps {
  gym: Gym;
}

const GymCard: React.FC<GymCardProps> = ({ gym }) => {
  return (
    <Link to={`/user/gym/${gym.id}`} className="block transition-transform hover:scale-[1.02]">
      <Card noPadding className="overflow-hidden flex flex-col h-full hover:border-zinc-700 transition-colors">
        {/* Image Placeholder */}
        <div className="h-32 bg-zinc-800 w-full" />
        
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-white mb-1">{gym.name}</h3>
          <p className="text-sm text-zinc-400 mb-3">{gym.location}</p>
          
          <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
            {gym.facilities.map((facility, index) => (
              <Badge key={index} variant="info" className="text-[10px]">
                {facility}
              </Badge>
            ))}
          </div>
          
          <div className="flex justify-end mt-2">
            <span className="text-yellow-500 font-bold">
              {gym.credit_price} CREDITS
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default GymCard;
