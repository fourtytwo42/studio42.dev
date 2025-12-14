'use client';

import { useState } from 'react';
import Image from 'next/image';

interface MediaItem {
  id: string;
  type: string;
  url: string;
  thumbnail?: string | null;
  title?: string | null;
}

interface ProductMediaProps {
  media: MediaItem[];
}

export default function ProductMedia({ media }: ProductMediaProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  if (!media || media.length === 0) {
    return null;
  }

  const images = media.filter((m) => m.type === 'IMAGE');
  const videos = media.filter((m) => m.type === 'VIDEO');

  const currentMedia = media[selectedIndex];
  const isVideo = currentMedia?.type === 'VIDEO';

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : media.length - 1));
    setIsVideoPlaying(false);
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < media.length - 1 ? prev + 1 : 0));
    setIsVideoPlaying(false);
  };

  const handleVideoClick = () => {
    setIsVideoPlaying(true);
  };

  return (
    <section
      className="product-media"
      style={{
        padding: 'var(--spacing-5xl) var(--spacing-xl)',
      }}
    >
      <div className="container">
        <h2
          style={{
            fontSize: 'var(--font-size-3xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--spacing-xl)',
            textAlign: 'center',
          }}
        >
          Media
        </h2>

        <div
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
          }}
        >
          {/* Main media display */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              paddingTop: '56.25%',
              backgroundColor: 'var(--color-background-tertiary)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              marginBottom: 'var(--spacing-lg)',
            }}
          >
            {isVideo && currentMedia ? (
              <>
                {isVideoPlaying ? (
                  <iframe
                    src={currentMedia.url}
                    title={currentMedia.title || 'Video'}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none',
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      backgroundColor: 'var(--color-background-tertiary)',
                    }}
                    onClick={handleVideoClick}
                  >
                    {currentMedia.thumbnail && (
                      <Image
                        src={currentMedia.thumbnail}
                        alt={currentMedia.title || 'Video thumbnail'}
                        fill
                        style={{
                          objectFit: 'cover',
                        }}
                      />
                    )}
                    <div
                      style={{
                        position: 'absolute',
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                      }}
                    >
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="white"
                        style={{ marginLeft: '4px' }}
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}
              </>
            ) : currentMedia ? (
              <Image
                src={currentMedia.url}
                alt={currentMedia.title || 'Media'}
                fill
                style={{
                  objectFit: 'cover',
                }}
              />
            ) : null}
          </div>

          {/* Thumbnail carousel */}
          {media.length > 1 && (
            <div
              style={{
                display: 'flex',
                gap: 'var(--spacing-md)',
                overflowX: 'auto',
                paddingBottom: 'var(--spacing-sm)',
              }}
            >
              {media.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedIndex(index);
                    setIsVideoPlaying(false);
                  }}
                  style={{
                    flexShrink: 0,
                    width: '120px',
                    height: '80px',
                    position: 'relative',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: selectedIndex === index ? '3px solid var(--color-primary)' : '3px solid transparent',
                    cursor: 'pointer',
                    backgroundColor: 'var(--color-background-tertiary)',
                    padding: 0,
                  }}
                >
                  {item.type === 'VIDEO' ? (
                    <>
                      {item.thumbnail ? (
                        <Image
                          src={item.thumbnail}
                          alt={item.title || 'Video thumbnail'}
                          fill
                          style={{
                            objectFit: 'cover',
                          }}
                        />
                      ) : null}
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="white"
                          style={{ marginLeft: '2px' }}
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </>
                  ) : (
                    <Image
                      src={item.url}
                      alt={item.title || 'Media thumbnail'}
                      fill
                      style={{
                        objectFit: 'cover',
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Navigation buttons */}
          {media.length > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 'var(--spacing-md)',
                marginTop: 'var(--spacing-lg)',
              }}
            >
              <button
                onClick={handlePrevious}
                style={{
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                style={{
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

