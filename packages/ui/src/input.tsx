"use client";
import React from "react";

interface InputProps {
  type: string;
  placeholder: string;
  className?: string;
}

export const Input = ({ type, placeholder, className }: InputProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`w-full px-4 py-3 text-black rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${className}`}
    />
  );
};
