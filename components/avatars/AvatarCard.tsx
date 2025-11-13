'use client';

import React, { useState } from 'react';
import { Avatar } from '@/types';
import { Card } from '@/components/ui/Card';
import { Play, Star } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface AvatarCardProps {
  avatar: Avatar;
  selected?: boolean;
  onClick: () => void;
}

export function AvatarCard({ avatar, selected, onClick }: AvatarCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [videoError, setVideoError] = useState(false);

  return (
    <Card
      hover
      onClick={onClick}
      className={cn(
        'cursor-pointer transition-all duration-200',
        selected && 'ring-2 ring-blue-600 border-blue-600'
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative aspect-[3/4] bg-gray-100 rounded-t-lg overflow-hidden">
        {/* Preview Image */}
        {!isHovering || videoError ? (
          <img
            src={avatar.previewUrl}
            alt={avatar.name}
            className="w-full h-full object-cover"
          />
        ) : (
          // Preview Video on Hover
          <video
            src={avatar.previewVideoUrl}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            onError={() => setVideoError(true)}
          />
        )}

        {/* Popular Badge */}
        {avatar.isPopular && (
          <div className="absolute top-2 left-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500 rounded-full">
              <Star className="h-3 w-3 text-white fill-white" />
              <span className="text-xs font-semibold text-white">Popular</span>
            </div>
          </div>
        )}

        {/* Play Icon Overlay */}
        {!isHovering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center">
              <Play className="h-6 w-6 text-gray-900 ml-0.5" />
            </div>
          </div>
        )}

        {/* Selected Checkmark */}
        {selected && (
          <div className="absolute top-2 right-2">
            <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Avatar Info */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 mb-1">{avatar.name}</h3>
        <div className="flex flex-wrap gap-1">
          {avatar.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
            >
              {tag}
            </span>
          ))}
          {avatar.tags.length > 2 && (
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
              +{avatar.tags.length - 2}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
