//memory store

export type OrderStatus = "PENDING" | "CONFIRMED" | "REJECTED";

export const orders = new Map<string, OrderStatus>();
