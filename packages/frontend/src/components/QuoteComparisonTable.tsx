"use client";

import React from "react";
import type { SupplierSummary, PartRow } from "@/app/page";
import QuoteTable from "./QuoteTable";
import PriceLegend from "./PriceLegend";

interface Props {
  parts: PartRow[];
  suppliers: SupplierSummary[];
  qtySum: number;
}

interface Score {
  supplierId: string;
  score: number;
}

export default function QuoteComparisonTable({
  parts,
  suppliers,
  qtySum,
}: Props) {
  if (!parts.length || !suppliers.length) {
    return <p className="text-center p-4">No data to display</p>;
  }

  const normalize = (val: number, min: number, max: number) =>
    max === min ? 0 : (val - min) / (max - min);

  const prices = suppliers.map((s) => s.totalPrice);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const ratings = suppliers.map((s) => s.rating);
  const minRating = Math.min(...ratings);
  const maxRating = Math.max(...ratings);

  const leads = suppliers.map((s) => s.leadTime);
  const minLead = Math.min(...leads);
  const maxLead = Math.max(...leads);

  const scores: Score[] = suppliers.map((s) => {
    const priceNorm = normalize(s.totalPrice, minPrice, maxPrice);
    const ratingNorm = 1 - normalize(s.rating, minRating, maxRating);
    const leadNorm = normalize(s.leadTime, minLead, maxLead);
    const score = priceNorm * 0.4 + ratingNorm * 0.4 + leadNorm * 0.2;
    return { supplierId: s.supplierId, score };
  });

  const topPickId = scores.reduce(
    (best, curr) => (curr.score < best.score ? curr : best),
    scores[0]
  ).supplierId;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">
        Detailed quotes comparison{" "}
        <span className="text-gray-500 font-normal text-lg">
          ({suppliers.length} suppliers)
        </span>
      </h2>

      <div className="overflow-x-auto">
        <QuoteTable
          parts={parts}
          suppliers={suppliers}
          qtySum={qtySum}
          topPickId={topPickId}
        />
      </div>

      <PriceLegend />
    </div>
  );
}
