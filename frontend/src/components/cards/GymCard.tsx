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
      <Card noPadding className="overflow-hidden flex flex-col hover:border-zinc-700 transition-colors">
        {/* Image — fixed height, consistent across all cards */}
        {gym.photos && gym.photos.length > 0 ? (
          <img 
            src={gym.photos[0]} 
            alt={gym.name}
            className="h-40 w-full object-cover flex-shrink-0" 
          />
        ) : (
          <div className="h-40 bg-gradient-to-br from-zinc-800 to-zinc-900 w-full flex-shrink-0" />
        )}
        
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{gym.name}</h3>
          <p className="text-sm text-zinc-400 mb-3 line-clamp-1">{gym.location}</p>
          
          <div className="flex flex-wrap gap-1.5 mb-3 mt-auto">
            {gym.facilities.slice(0, 3).map((facility, index) => (
              <Badge key={index} variant="info" className="text-[10px]">
                {facility}
              </Badge>
            ))}
            {gym.facilities.length > 3 && (
              <span className="text-[10px] text-zinc-500">+{gym.facilities.length - 3} lagi</span>
            )}
          </div>
          
          <div className="flex justify-end">
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
