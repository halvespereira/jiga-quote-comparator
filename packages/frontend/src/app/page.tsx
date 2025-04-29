import React from "react";
import QuoteComparisonTable from "@/components/QuoteComparisonTable";
import QuoteSelector from "@/components/QuoteSelector";

export interface SupplierSummary {
  supplierId: string;
  name: string;
  country: string;
  rating: number;
  shippingPrice: number;
  leadTime: number;
  totalPrice: number;
  topPick: boolean;
}

export interface PartSupplierDetail {
  supplierId: string;
  name: string;
  country: string;
  rating: number;
  unitPrice: number;
  totalPrice: number;
  leadTime: number;
  topPick: boolean;
}

export interface PartRow {
  partId: string;
  partName: string;
  qty: number;
  suppliers?: PartSupplierDetail[];
}

export interface RawComparisonResult {
  parts: PartRow[];
  shippingFees: number[];
  leadTimes: number[];
  totals: number[];
  qtySum: number;
}

export interface ComparisonResult {
  parts: PartRow[];
  suppliers: SupplierSummary[];
  qtySum: number;
}

async function fetchComparison(quoteId: string): Promise<ComparisonResult> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/quote-comparison?quoteId=${quoteId}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error(res.statusText || "Failed to fetch comparison data");
  }
  const json: RawComparisonResult = await res.json();
  const { parts, shippingFees, leadTimes, totals, qtySum } = json;

  const firstPartSuppliers = parts[0]?.suppliers ?? [];
  const minTotal = Math.min(...totals);
  const suppliers: SupplierSummary[] = firstPartSuppliers.map((s, idx) => ({
    supplierId: s.supplierId,
    name: s.name,
    country: s.country,
    rating: s.rating,
    shippingPrice: shippingFees[idx] ?? 0,
    leadTime: leadTimes[idx] ?? 0,
    totalPrice: totals[idx] ?? 0,
    topPick: totals[idx] === minTotal,
  }));

  return { parts, suppliers, qtySum };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ quoteId?: string }>;
}) {
  const { quoteId } = await searchParams;

  try {
    const data = await fetchComparison(quoteId || "q1");

    return (
      <div className="p-6 flex justify-center">
        <div className="w-full max-w-7xl">
          <QuoteSelector />
          <QuoteComparisonTable
            parts={data.parts}
            suppliers={data.suppliers}
            qtySum={data.qtySum}
          />
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-6 flex justify-center">
        <div
          className="w-full max-w-md bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {(error as Error).message}</span>
        </div>
      </div>
    );
  }
}
