import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { type Gym } from '../../types';

export interface GymCardProps {
  gym: Gym;
}

const GymCard: React.FC<GymCardProps> = ({ gym }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <Link to={`/user/gym/${gym.id}`} className="block h-full transition-transform hover:scale-[1.02]">
      <Card noPadding className="h-full overflow-hidden flex flex-col hover:border-zinc-700 transition-colors">
        {/* Image — fixed height, consistent across all cards */}
        {gym.image_url || (gym.photos && gym.photos.length > 0) ? (
          <div className="relative h-40 w-full flex-shrink-0 bg-zinc-800 overflow-hidden">
            {/* Skeleton Loader */}
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-zinc-700/50 animate-pulse" />
            )}
            <img 
              src={gym.image_url || (Array.isArray(gym.photos) && gym.photos[0]) || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80"}
              alt={gym.name}
              onLoad={() => setIsImageLoaded(true)}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80";
              }}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`} 
            />
          </div>
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
