// ShowInventory.tsx


import InventoryTable from "./InventoryTable";





const ShowInventory = () => {
    
  return (
    <div className="mt-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">
        Inventory Service Main Page
      </h1>
      <InventoryTable />
    </div>
  );
};

export default ShowInventory;
