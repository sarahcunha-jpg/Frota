import React from 'react';

// H1 - 32px, bold, main titles
export const H1: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <h1 className={`text-3xl font-bold text-neutral-900 ${className}`}>{children}</h1>;

// H2 - 24px, bold, section titles
export const H2: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <h2 className={`text-2xl font-bold text-neutral-800 ${className}`}>{children}</h2>;

// H3 - 20px, semibold, subtitles
export const H3: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <h3 className={`text-xl font-semibold text-neutral-800 ${className}`}>{children}</h3>;

// H4 - 16px, semibold, card titles
export const H4: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <h4 className={`text-lg font-semibold text-neutral-800 ${className}`}>{children}</h4>;

// Body - 14px, regular, common text
export const Body: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <p className={`text-base font-normal text-neutral-700 ${className}`}>{children}</p>;

// Small - 12px, regular, labels and hints
export const Small: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <span className={`text-sm font-normal text-neutral-600 ${className}`}>{children}</span>;

// Caption - 11px, regular, timestamps
export const Caption: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <span className={`text-xs font-normal text-neutral-500 ${className}`}>{children}</span>;

// Overline - 10px, uppercase, labels
export const Overline: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <span className={`text-xs font-semibold uppercase tracking-wider text-neutral-600 ${className}`}>
    {children}
  </span>
);