import React from "react";

interface LabelProps {
  children: React.ReactNode;
  className?: string;
}

export const Label = ({ children, className }: LabelProps) => {
  return (
    <label className={`block text-sm font-medium text-gray-700 ${className}`}>
      {children}
    </label>
  );
};
