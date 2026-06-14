import React from 'react';

const GlassCard = ({ 
  children, 
  title, 
  icon: Icon, 
  action, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`glass-card ${className}`} {...props}>
      {(title || Icon || action) && (
        <div className="glass-card-header">
          {title || Icon ? (
            <div className="glass-card-title">
              {Icon && <Icon size={20} className="text-primary" style={{ color: 'var(--primary)' }} />}
              {title && <span className="label-sm">{title}</span>}
            </div>
          ) : <div />}
          {action && <div className="glass-card-action">{action}</div>}
        </div>
      )}
      <div className="glass-card-body">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
