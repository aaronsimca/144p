import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export function Select({ children, ...props }: SelectProps) {
  return (
    <select
      className="w-full border border-gray-300 rounded px-2 py-1"
      {...props}
    >
      {children}
    </select>
  );
}