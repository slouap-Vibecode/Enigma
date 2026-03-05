'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeSelector() {
  const { themeName, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const currentTheme = availableThemes.find(t => t.name === themeName);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="theme-selector-button"
        style={{
          background: 'var(--theme-button-bg)',
          color: 'var(--theme-button-text)',
          border: '2px solid var(--theme-border)',
          borderRadius: 'var(--theme-radius-medium)',
          padding: '8px 12px',
          fontSize: 'small',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: 'var(--theme-shadow-button)',
          transition: 'all 0.2s ease',
          minWidth: '140px',
          justifyContent: 'space-between'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--theme-button-hover-bg)';
          e.currentTarget.style.color = 'var(--theme-button-hover-text)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--theme-button-bg)';
          e.currentTarget.style.color = 'var(--theme-button-text)';
        }}
        title="Changer de thème"
      >
        <span>🎨</span>
        <span>{currentTheme?.displayName || 'Thème'}</span>
        <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            right: '0',
            background: 'var(--theme-background-secondary)',
            border: '2px solid var(--theme-border)',
            borderRadius: 'var(--theme-radius-medium)',
            boxShadow: 'var(--theme-shadow-card)',
            zIndex: 1000,
            marginTop: '4px',
            overflow: 'hidden'
          }}
        >
          {availableThemes.map((theme) => (
            <button
              key={theme.name}
              onClick={() => {
                setTheme(theme.name);
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: themeName === theme.name ? 'var(--theme-accent)' : 'transparent',
                color: themeName === theme.name ? 'var(--theme-button-hover-text)' : 'var(--theme-text)',
                border: 'none',
                cursor: 'pointer',
                fontSize: 'small',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                borderBottom: '1px solid var(--theme-border)'
              }}
              onMouseEnter={(e) => {
                if (themeName !== theme.name) {
                  e.currentTarget.style.background = 'var(--theme-input-bg)';
                }
              }}
              onMouseLeave={(e) => {
                if (themeName !== theme.name) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {theme.displayName}
            </button>
          ))}
        </div>
      )}

      {/* Fermer le menu en cliquant ailleurs */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 999
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}