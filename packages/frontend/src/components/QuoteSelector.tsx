"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function QuoteSelector() {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get("quoteId") ?? "q1";

  const handle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`/?quoteId=${e.target.value}`);
  };

  return (
    <div className="mb-6 flex items-center space-x-2">
      <label htmlFor="quote" className="font-medium">
        Select Quote:
      </label>
      <select
        id="quote"
        value={current}
        onChange={handle}
        className="px-3 py-2 border rounded"
      >
        <option value="q1">Quote One</option>
        <option value="q2">Quote Two</option>
        <option value="q3">Not found quote</option>
      </select>
    </div>
  );
}
