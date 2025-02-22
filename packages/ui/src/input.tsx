"use client";
import React, { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <input
      ref={ref}
      className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
      {...props}
    />
  );
});

Input.displayName = "Input";
