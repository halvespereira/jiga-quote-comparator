"use client";

import React from "react";
import { FaStar } from "react-icons/fa";
import type { SupplierSummary, PartRow } from "@/app/page";

interface Props {
  parts: PartRow[];
  suppliers: SupplierSummary[];
  qtySum: number;
  topPickId: string;
}

export default function QuoteTable({
  parts,
  suppliers,
  qtySum,
  topPickId,
}: Props) {
  return (
    <table className="min-w-full border-collapse">
      <thead>
        <tr>
          <th
            rowSpan={2}
            className="border border-gray-200 p-4 sticky left-0 bg-gray-100 text-left"
          >
            Part name
          </th>
          <th
            rowSpan={2}
            className="border border-gray-200 p-4 text-center bg-gray-100"
          >
            Qty
          </th>
          {suppliers.map((s) => (
            <th
              key={s.supplierId}
              colSpan={2}
              className="relative border border-gray-200 p-2 bg-white text-left align-top"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-sm text-gray-600">{s.country}</div>
                </div>
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-400" />
                  <span className="font-bold text-gray-700">{s.rating}</span>
                </div>
              </div>
              {s.supplierId === topPickId && (
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                  TOP PICK
                </span>
              )}
            </th>
          ))}
        </tr>
        <tr>
          {suppliers.map((s) => (
            <React.Fragment key={`sub-${s.supplierId}`}>
              <th className="border border-gray-200 p-2 text-center text-sm font-medium bg-gray-100">
                Unit Price
              </th>
              <th className="border border-gray-200 p-2 text-center text-sm font-medium bg-gray-100">
                Price
              </th>
            </React.Fragment>
          ))}
        </tr>
      </thead>

      <tbody>
        {parts.map((part) => {
          const rowSups = part.suppliers ?? [];
          const unitPrices = rowSups.map((c) => c.unitPrice);
          const sorted = [...unitPrices].sort((a, b) => a - b);
          const q1 = sorted[Math.floor(sorted.length * 0.25)];
          const q2 = sorted[Math.floor(sorted.length * 0.5)];
          const q3 = sorted[Math.floor(sorted.length * 0.75)];

          return (
            <tr key={part.partId} className="hover:bg-gray-50">
              <td className="border border-gray-200 p-4 sticky left-0 bg-white">
                {part.partName}
              </td>
              <td className="border border-gray-200 p-4 text-center">
                {part.qty}
              </td>
              {suppliers.map((supplier) => {
                const cell = rowSups.find(
                  (r) => r.supplierId === supplier.supplierId
                );
                if (!cell) {
                  return (
                    <React.Fragment
                      key={`empty-${supplier.supplierId}-${part.partId}`}
                    >
                      <td className="border border-gray-200 p-4 text-center"></td>
                      <td className="border border-gray-200 p-4 text-center"></td>
                    </React.Fragment>
                  );
                }
                let bg = "bg-yellow-100";
                if (cell.unitPrice <= q1) bg = "bg-green-100";
                else if (cell.unitPrice <= q2) bg = "bg-yellow-100";
                else if (cell.unitPrice <= q3) bg = "bg-orange-100";
                else bg = "bg-red-100";
                return (
                  <React.Fragment
                    key={`cell-${supplier.supplierId}-${part.partId}`}
                  >
                    <td
                      className={`border border-gray-200 p-4 text-center ${bg}`}
                    >
                      ${cell.unitPrice.toFixed(2)}
                    </td>
                    <td
                      className={`border border-gray-200 p-4 text-center ${bg}`}
                    >
                      ${cell.totalPrice.toFixed(2)}
                    </td>
                  </React.Fragment>
                );
              })}
            </tr>
          );
        })}
      </tbody>

      <tfoot>
        <tr>
          <td className="border border-gray-200 p-4 sticky left-0 bg-white font-medium">
            Shipping Fee
          </td>
          <td className="border border-gray-200 p-4"></td>
          {suppliers.map((s) => (
            <React.Fragment key={`ship-${s.supplierId}`}>
              <td className="border border-gray-200 p-4 text-center"></td>
              <td className="border border-gray-200 p-4 text-center bg-gray-50">
                ${s.shippingPrice.toFixed(2)}
              </td>
            </React.Fragment>
          ))}
        </tr>
        <tr>
          <td className="border border-gray-200 p-4 sticky left-0 bg-white font-medium">
            Lead time
          </td>
          <td className="border border-gray-200 p-4"></td>
          {suppliers.map((s) => (
            <React.Fragment key={`lead-${s.supplierId}`}>
              <td className="border border-gray-200 p-4 text-center"></td>
              <td className="border border-gray-200 p-4 text-center bg-gray-50">
                {s.leadTime}d
              </td>
            </React.Fragment>
          ))}
        </tr>
        <tr>
          <td className="border border-gray-200 p-4 sticky left-0 bg-white font-bold">
            Total Price
          </td>
          <td className="border border-gray-200 p-4 text-center font-bold"></td>
          {suppliers.map((s) => {
            const allTotals = suppliers.map((x) => x.totalPrice);
            const min = Math.min(...allTotals);
            const max = Math.max(...allTotals);
            const bg =
              s.totalPrice === min
                ? "bg-green-200"
                : s.totalPrice === max
                ? "bg-red-200"
                : "bg-yellow-200";
            return (
              <React.Fragment key={`total-${s.supplierId}`}>
                <td className="border border-gray-200 p-4"></td>
                <td
                  className={`border border-gray-200 p-4 text-center font-bold ${bg}`}
                >
                  ${s.totalPrice.toFixed(2)}
                </td>
              </React.Fragment>
            );
          })}
        </tr>
        <tr>
          <td className="border border-gray-200 p-4 sticky left-0 bg-white font-bold">
            Total Quantity
          </td>
          <td className="border border-gray-200 p-4 text-center font-bold">
            {qtySum}
          </td>
          {suppliers.map((s) => (
            <React.Fragment key={`qty-${s.supplierId}`}>
              <td className="border border-gray-200 p-4"></td>
              <td className="border border-gray-200 p-4"></td>
            </React.Fragment>
          ))}
        </tr>
      </tfoot>
    </table>
  );
}
