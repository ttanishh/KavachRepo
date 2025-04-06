// components/u/MediaGallery.jsx
import React, { useState } from 'react';
import Image from 'next/image';

export function MediaGallery({
  media = [],
  className = '',
  ...props
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  if (!media || media.length === 0) {
    return (
      <div className={`text-center py-8 text-surface-500 ${className}`} {...props}>
        No media available.
      </div>
    );
  }
  
  const activeMedia = media[activeIndex];
  const isImage = activeMedia.type?.startsWith('image/') || activeMedia.url?.match(/\.(jpeg|jpg|png|gif|webp)$/i);
  const isVideo = activeMedia.type?.startsWith('video/') || activeMedia.url?.match(/\.(mp4|webm|ogg|mov)$/i);
  
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      <div className="relative aspect-video bg-surface-100 rounded-lg overflow-hidden">
        {isImage && (
          <Image
            src={activeMedia.url}
            alt={`Evidence ${activeIndex + 1}`}
            fill
            className="object-contain"
          />
        )}
        
        {isVideo && (
          <video
            src={activeMedia.url}
            controls
            className="w-full h-full"
          />
        )}
        
        {!isImage && !isVideo && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-surface-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p className="text-surface-500">File: {activeMedia.name || activeMedia.url.split('/').pop()}</p>
            </div>
          </div>
        )}
      </div>
      
      {media.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {media.map((item, index) => {
            const isThumbnailImage = item.type?.startsWith('image/') || item.url?.match(/\.(jpeg|jpg|png|gif|webp)$/i);
            const isThumbnailVideo = item.type?.startsWith('video/') || item.url?.match(/\.(mp4|webm|ogg|mov)$/i);
            
            return (
              <button
                key={index}
                type="button"
                className={`
                  relative aspect-square rounded-md overflow-hidden 
                  ${activeIndex === index ? 'ring-2 ring-primary-500' : 'hover:opacity-80'}
                `}
                onClick={() => setActiveIndex(index)}
              >
                {isThumbnailImage ? (
                  <Image
                    src={item.url}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                ) : isThumbnailVideo ? (
                  <div className="bg-surface-200 h-full w-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                ) : (
                  <div className="bg-surface-200 h-full w-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}