import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import ProjectInfo from "./components/ProjectInfo";
import InventoryService from "./components/Inventory-service/InventoryService";
import OrderService from "./components/OrderService";
import ShowInventory from "./components/Inventory-service/ShowInventory";
import AddProduct from "./components/Inventory-service/AddProducts";
import CreateOrder from "./components/Inventory-service/CreateOrder";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Navbar stays fixed on top */}
        <NavBar />

        {/* Page content */}
        <main className="flex-grow flex items-baseline justify-center p-6 bg-amber-100">
          <Routes>
            {/*MAIN */}
            <Route path="/" element={<ProjectInfo />} />
            {/*INVENTORY */}
            <Route path="/inventory-service" element={<InventoryService />} />
            <Route path="/inventory-service" element={<InventoryService />} />
            <Route path="/inventory-service/show" element={<ShowInventory />} />
            <Route path="/inventory-service/create" element={<CreateOrder />} />
            <Route path="/inventory-service/add" element={<AddProduct />} />

            {/*ORDER */}
            <Route path="/order-service" element={<OrderService />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
