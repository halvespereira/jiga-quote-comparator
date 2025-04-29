import mongoose, { PipelineStage } from "mongoose";
import { Quote } from "./quote.model";

interface SupplierCellRaw {
  supplierId: mongoose.Types.ObjectId;
  name: string;
  country: string;
  rating: number;
  unitPrice: number;
  totalPrice: number;
  leadTime: number;
  topPick: boolean;
}

interface PartRowRaw {
  partId: mongoose.Types.ObjectId;
  partName: string;
  qty: number;
  suppliers: SupplierCellRaw[];
}

export interface SupplierCell {
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
  suppliers: SupplierCell[];
}

export interface ComparisonResult {
  parts: PartRow[];
  shippingFees: number[];
  leadTimes: number[];
  totals: number[];
  qtySum: number;
}

export async function compareQuote(quoteId: string): Promise<ComparisonResult> {
  const pipeline: PipelineStage[] = [
    { $match: { _id: quoteId } },
    { $unwind: "$offers" },
    {
      $lookup: {
        from: "suppliers",
        localField: "offers.supplierId",
        foreignField: "_id",
        as: "supplier",
      },
    },
    { $unwind: "$supplier" },
    {
      $lookup: {
        from: "ratings",
        let: { supId: "$offers.supplierId" },
        pipeline: [
          { $match: { $expr: { $eq: ["$supplierId", "$$supId"] } } },
          { $project: { _id: 0, rating: 1 } },
        ],
        as: "rating",
      },
    },
    {
      $addFields: {
        rating: { $ifNull: [{ $arrayElemAt: ["$rating.rating", 0] }, 0] },
      },
    },
    {
      $lookup: {
        from: "items",
        localField: "offers.items.itemId",
        foreignField: "_id",
        as: "itemDocs",
      },
    },
    {
      $project: {
        _id: 0,
        supplierId: "$offers.supplierId",
        name: "$supplier.name",
        country: "$supplier.country",
        rating: "$rating",
        items: {
          $map: {
            input: "$offers.items",
            as: "it",
            in: {
              itemId: "$$it.itemId",
              partName: {
                $arrayElemAt: [
                  {
                    $map: {
                      input: {
                        $filter: {
                          input: "$itemDocs",
                          cond: { $eq: ["$$this._id", "$$it.itemId"] },
                        },
                      },
                      as: "d",
                      in: "$$d.name",
                    },
                  },
                  0,
                ],
              },
              unitPrice: "$$it.unitPrice",
              qty: "$$it.quantity",
              totalPrice: { $multiply: ["$$it.unitPrice", "$$it.quantity"] },
              leadTime: "$offers.leadTime",
            },
          },
        },
        totalPrice: "$offers.totalPrice",
      },
    },
    {
      $group: {
        _id: null,
        suppliers: { $push: "$$ROOT" },
      },
    },
    { $unwind: "$suppliers" },
    { $unwind: "$suppliers.items" },
    {
      $group: {
        _id: {
          itemId: "$suppliers.items.itemId",
          partName: "$suppliers.items.partName",
          qty: "$suppliers.items.qty",
        },
        suppliers: {
          $push: {
            supplierId: "$suppliers.supplierId",
            name: "$suppliers.name",
            country: "$suppliers.country",
            rating: "$suppliers.rating",
            unitPrice: "$suppliers.items.unitPrice",
            totalPrice: "$suppliers.items.totalPrice",
            leadTime: "$suppliers.items.leadTime",
            topPick: "$suppliers.topPick",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        partId: "$_id.itemId",
        partName: "$_id.partName",
        qty: "$_id.qty",
        suppliers: 1,
      },
    },
    {
      $group: {
        _id: null,
        parts: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        _id: 0,
        parts: 1,
      },
    },
  ];

  const [aggResult] = await Quote.aggregate<{ parts: PartRowRaw[] }>(
    pipeline
  ).exec();
  const rawParts = aggResult?.parts || [];

  const quote = await Quote.findById(quoteId).lean();
  if (!quote) {
    throw new Error("Quote not found");
  }

  const parts: PartRow[] = rawParts.map((p) => ({
    partId: p.partId.toString(),
    partName: p.partName,
    qty: p.qty,
    suppliers: p.suppliers.map((s) => ({
      supplierId: s.supplierId.toString(),
      name: s.name,
      country: s.country,
      rating: s.rating,
      unitPrice: s.unitPrice,
      totalPrice: s.totalPrice,
      leadTime: s.leadTime,
      topPick: s.topPick,
    })),
  }));

  const shippingFees = quote.offers.map((o) => o.shippingPrice);
  const leadTimes = quote.offers.map((o) => o.leadTime);
  const totals =
    parts[0]?.suppliers.map((_, i) =>
      parts.reduce((sum, p) => sum + p.suppliers[i].totalPrice, 0)
    ) || [];
  const qtySum = parts.reduce((sum, p) => sum + p.qty, 0);

  return { parts, shippingFees, leadTimes, totals, qtySum };
}
