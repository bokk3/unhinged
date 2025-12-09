"use client";

import { motion } from "framer-motion";
import { UserX, Eye } from "lucide-react";

interface ProfileCardProps {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
}

export const ProfileCard = ({ 
  name, 
  username, 
  avatar, 
  bio, 
  followers, 
  following, 
  posts 
}: ProfileCardProps) => {
  const handleFollow = () => {
    // Do nothing - can't follow
  };

  const handleMessage = () => {
    // Do nothing - can't message
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      {/* Cover */}
      <div className="h-20 bg-gradient-to-r from-primary/30 to-purple-500/30" />
      
      {/* Avatar */}
      <div className="px-4 -mt-8">
        <img 
          src={avatar}
          alt={name}
          className="w-16 h-16 rounded-full border-4 border-card object-cover"
        />
      </div>

      {/* Info */}
      <div className="p-4 pt-2">
        <h3 className="font-bold">{name}</h3>
        <p className="text-sm text-muted-foreground">@{username}</p>
        <p className="text-sm mt-2">{bio}</p>

        {/* Stats */}
        <div className="flex gap-4 mt-3 text-sm">
          <div>
            <span className="font-bold">{posts}</span>
            <span className="text-muted-foreground ml-1">posts</span>
          </div>
          <div>
            <span className="font-bold">{followers.toLocaleString()}</span>
            <span className="text-muted-foreground ml-1">followers</span>
          </div>
          <div>
            <span className="font-bold">{following}</span>
            <span className="text-muted-foreground ml-1">following</span>
          </div>
        </div>

        {/* Actions - All Disabled */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleFollow}
            disabled
            className="flex-1 py-2 bg-secondary text-muted-foreground rounded-lg text-sm font-medium flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
            title="Following people creates expectations"
          >
            <UserX size={16} />
            Follow
          </button>
          <button
            onClick={handleMessage}
            disabled
            className="flex-1 py-2 bg-secondary text-muted-foreground rounded-lg text-sm font-medium flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
            title="Messaging is too much commitment"
          >
            <Eye size={16} />
            Observe Only
          </button>
        </div>
        
        <p className="text-xs text-center text-muted-foreground mt-3 italic">
          Interaction features disabled for your comfort.
        </p>
      </div>
    </motion.div>
  );
};
