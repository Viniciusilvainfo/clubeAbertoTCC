import React from 'react';
import { getAssetUrl } from '../services/api';

export default function ClubLogo({ src, alt, fallback, size = 48, fontSize = 16, fallbackBackground = 'var(--primary)' }) {
  const hasImage = Boolean(src);

  return (
    <div
      style={{
        width: size,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0, // impede que o logo encolha em layouts flexíveis
        backgroundColor: hasImage ? 'transparent' : fallbackBackground,
        color: '#fff',
        fontWeight: 700,
        fontSize,
        lineHeight: 1,
      }}
    >
      {hasImage ? (
        <img
          src={getAssetUrl(src)}
          alt={alt}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        fallback
      )}
    </div>
  );
}