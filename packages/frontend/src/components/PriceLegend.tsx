"use client";

import React from "react";

export default function PriceLegend() {
  return (
    <div className="mt-6 flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Best price</span>
        <div className="flex h-2 w-32">
          <div className="w-1/4 bg-green-100 h-full"></div>
          <div className="w-1/4 bg-yellow-100 h-full"></div>
          <div className="w-1/4 bg-orange-100 h-full"></div>
          <div className="w-1/4 bg-red-100 h-full"></div>
        </div>
        <span className="text-sm font-medium">Highest price</span>
      </div>
    </div>
  );
}
