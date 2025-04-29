import mongoose, { Document, Schema, Types } from "mongoose";

export interface OfferItem {
  itemId: Types.ObjectId;
  unitPrice: number;
  quantity: number;
}

export interface Offer {
  supplierId: Types.ObjectId;
  items: OfferItem[];
  shippingPrice: number;
  totalPrice: number;
  leadTime: number;
}

export interface QuoteDoc extends Document {
  _id: string;
  customerName: string;
  offers: Offer[];
}

const OfferItemSchema = new Schema<OfferItem>(
  {
    itemId: { type: Schema.Types.ObjectId, required: true, ref: "Item" },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const OfferSchema = new Schema<Offer>(
  {
    supplierId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Supplier",
    },
    items: { type: [OfferItemSchema], required: true },
    shippingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    leadTime: { type: Number, required: true },
  },
  { _id: false }
);

const QuoteSchema = new Schema<QuoteDoc>(
  {
    _id: { type: String, required: true },
    customerName: { type: String, required: true },
    offers: { type: [OfferSchema], required: true },
  },
  { _id: false, collection: "quotes", timestamps: true }
);

export const Quote = mongoose.model<QuoteDoc>("Quote", QuoteSchema);
