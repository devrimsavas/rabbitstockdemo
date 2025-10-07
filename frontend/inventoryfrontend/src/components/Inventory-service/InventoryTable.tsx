import { useState, useEffect } from "react";

// interface for Product
interface IProduct {
  id: number;
  name: string;
  amount: number;
}

// get all products
const getAllProducts = async (): Promise<IProduct[]> => {
  const response = await fetch("http://localhost:3005/allitems");
  if (!response.ok) {
    console.error("fetch error");
    return [];
  }
  const data = await response.json();
  return data.items; // your backend returns { items: [...] }
};

const InventoryTable = () => {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    getAllProducts().then(setProducts).catch(console.error);
  }, []); // ✅ run once when mounted

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Inventory List</h2>
      <table className="w-full border border-gray-300 bg-white rounded shadow">
        <thead className="bg-blue-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="border px-4 py-2">{p.id}</td>
              <td className="border px-4 py-2">{p.name}</td>
              <td className="border px-4 py-2">{p.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
