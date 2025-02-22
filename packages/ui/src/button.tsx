"use client";
import React from "react";
import { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
}

// Button Variants
const buttonVariants = {
  primary: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white",
  secondary: "bg-gradient-to-r from-gray-800 to-gray-900 text-white",
  danger: "bg-red-500 text-white",
};

// Size Variants
const buttonSizes = {
  sm: "text-sm py-2 px-4",
  md: "text-base py-3 px-6",
  lg: "text-lg py-4 px-8",
};

export const Button = ({
  children,
  className,
  type,
  variant,
  size,
}: ButtonProps) => {
  return (
    <button
      className={`w-full 
          ${buttonSizes[size || "md"]}
        font-semibold rounded-lg hover:opacity-90 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md 
        ${className} 
        ${buttonVariants[variant || "primary"]}`}
      type={type || "submit"}
    >
      {children}
    </button>
  );
};
