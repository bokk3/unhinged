"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal } from "lucide-react";

interface PostProps {
  id: number;
  author: string;
  avatar: string;
  content: string;
  image?: string;
  timeAgo: string;
  likes: number;
  comments: number;
}

const LIKE_FAIL_MESSAGES = [
  "Connection timed out",
  "Server busy, try again later",
  "Like failed to register",
  "Network error",
  "Unable to process",
  "Feature temporarily disabled",
  "Rate limit exceeded",
  "Unexpected error",
];

export const Post = ({ id, author, avatar, content, image, timeAgo, likes, comments }: PostProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeError, setLikeError] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    // Pretend to like, then fail
    setIsLiked(true);
    setLikeCount(prev => prev + 1);
    
    setTimeout(() => {
      setIsLiked(false);
      setLikeCount(prev => prev - 1);
      setLikeError(LIKE_FAIL_MESSAGES[Math.floor(Math.random() * LIKE_FAIL_MESSAGES.length)]);
      
      setTimeout(() => setLikeError(null), 2000);
    }, 500 + Math.random() * 1000);
  };

  const handleComment = () => {
    setShowComments(!showComments);
  };

  const handleShare = () => {
    // Do nothing, just animate
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <img 
          src={avatar} 
          alt={author}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="font-bold text-sm">{author}</p>
          <p className="text-xs text-muted-foreground">{timeAgo}</p>
        </div>
        <button className="p-2 hover:bg-secondary rounded-full transition-colors">
          <MoreHorizontal size={20} className="text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm">{content}</p>
      </div>

      {/* Image */}
      {image && (
        <img 
          src={image} 
          alt="Post content"
          className="w-full aspect-video object-cover"
        />
      )}

      {/* Stats */}
      <div className="px-4 py-2 flex items-center gap-4 text-xs text-muted-foreground border-t border-border">
        <span>{likeCount.toLocaleString()} likes</span>
        <span>{comments} comments</span>
      </div>

      {/* Actions */}
      <div className="px-4 py-2 border-t border-border flex items-center gap-2">
        <button 
          onClick={handleLike}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
            isLiked 
              ? "text-red-500" 
              : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          <span className="text-sm">Like</span>
        </button>
        <button 
          onClick={handleComment}
          className="flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-muted-foreground hover:bg-secondary transition-colors"
        >
          <MessageCircle size={18} />
          <span className="text-sm">Comment</span>
        </button>
        <button 
          onClick={handleShare}
          className="flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-muted-foreground hover:bg-secondary transition-colors"
        >
          <Share size={18} />
          <span className="text-sm">Share</span>
        </button>
        <button className="p-2 rounded-lg text-muted-foreground hover:bg-secondary transition-colors">
          <Bookmark size={18} />
        </button>
      </div>

      {/* Like Error */}
      {likeError && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="px-4 py-2 bg-red-500/10 border-t border-red-500/30 text-center"
        >
          <span className="text-xs text-red-400">⚠️ {likeError}</span>
        </motion.div>
      )}

      {/* Disabled Comments */}
      {showComments && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="px-4 py-3 bg-secondary/30 border-t border-border"
        >
          <input
            type="text"
            placeholder="Better not to say anything..."
            disabled
            className="w-full p-3 bg-secondary/50 rounded-lg text-sm cursor-not-allowed opacity-50"
          />
          <p className="text-xs text-muted-foreground mt-2 text-center italic">
            Comments are disabled for your mental health.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};
