import React from 'react';
import Link from 'next/link';

interface VantaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  withLink?: boolean;
}

export const VantaLogo: React.FC<VantaLogoProps> = ({
  className = '',
  size = 'md',
  withLink = true,
}) => {
  const heights = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
  };

  const content = (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Official Vanta Production Logo */}
      <img
        src="/images/vanta-logo.jpg"
        alt="VANTA PRODUCTION"
        className={`${heights[size]} w-auto object-contain invert mix-blend-screen hover:opacity-90 transition-opacity`}
      />
    </div>
  );

  if (withLink) {
    return (
      <Link href="/" className="group inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
};
