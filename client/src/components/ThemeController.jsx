import React, { useState, useEffect, useRef } from 'react';
import { Settings, RefreshCw, Moon, Sun, Cloud, CloudRain, CloudLightning } from 'lucide-react';

const ThemeController = ({ 
  currentTheme, 
  onThemeChange, 
  isAutoTheme, 
  onToggleAutoTheme, 
  currentUnit, 
  onUnitChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  // Close panel on clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const themes = [
    { id: 'clear', name: 'Clear Sky', dotClass: 'theme-dot-clear', icon: Sun },
    { id: 'cloudy', name: 'Cloudy', dotClass: 'theme-dot-cloudy', icon: Cloud },
    { id: 'rainy', name: 'Rainy', dotClass: 'theme-dot-rainy', icon: CloudRain },
    { id: 'thunderstorm', name: 'Storm', dotClass: 'theme-dot-thunder', icon: CloudLightning }
  ];

  return (
    <div className="theme-controller-drawer" ref={panelRef}>
      <button 
        className="theme-controller-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Open Theme & Unit Settings"
      >
        <Settings size={22} />
      </button>

      {isOpen && (
        <div className="theme-controller-panel">
          <div>
            <h3 className="label-sm" style={{ marginBottom: '12px', color: '#ffffff' }}>Temperature Unit</h3>
            <div className="segmented-control" style={{ width: '100%' }}>
              <div 
                className={`segmented-control-option ${currentUnit === 'C' ? 'active' : ''}`}
                style={{ flex: 1, textAlign: 'center' }}
                onClick={() => onUnitChange('C')}
              >
                Celsius (°C)
              </div>
              <div 
                className={`segmented-control-option ${currentUnit === 'F' ? 'active' : ''}`}
                style={{ flex: 1, textAlign: 'center' }}
                onClick={() => onUnitChange('F')}
              >
                Fahrenheit (°F)
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }} />

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 className="label-sm" style={{ color: '#ffffff' }}>Visual Theme</h3>
              <button
                onClick={onToggleAutoTheme}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: isAutoTheme ? 'var(--primary)' : 'var(--on-surface-variant)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  outline: 'none'
                }}
                title="Toggle Auto-theme (binds to search weather)"
              >
                <RefreshCw size={10} style={{ transform: isAutoTheme ? 'rotate(180deg)' : 'none', transition: 'transform 0.4s' }} />
                <span>{isAutoTheme ? 'Auto: On' : 'Manual'}</span>
              </button>
            </div>

            <div className="theme-swatch-list">
              {themes.map((theme) => {
                const Icon = theme.icon;
                const isActive = currentTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    className={`theme-swatch ${isActive ? 'active' : ''}`}
                    onClick={() => onThemeChange(theme.id)}
                  >
                    <span className={`theme-dot ${theme.dotClass}`} />
                    <span>{theme.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeController;
