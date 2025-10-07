import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="bg-blue-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-semibold tracking-wide">
          RabbitMQ Demo
        </h1>

        <ul className="flex space-x-6">
          {/* Home */}
          <li>
            <Link
              to="/"
              className="text-white hover:bg-blue-600 px-3 py-2 rounded transition"
            >
              Home
            </Link>
          </li>

          {/* Inventory dropdown (no link on main title) */}
          <li className="relative group">
            <span className="text-white hover:bg-blue-600 px-3 rounded transition inline-block cursor-pointer">
              Inventory ▾
            </span>

            <div className="absolute left-0 top-full w-56">
              <ul
                className="bg-blue-700 text-white rounded shadow-lg py-1
                            invisible opacity-0 translate-y-1
                            group-hover:visible group-hover:opacity-100 group-hover:translate-y-0
                            transition duration-150 ease-out"
              >
                <li>
                  <Link
                    to="/inventory-service/show"
                    className="block px-4 py-2 hover:bg-blue-600"
                  >
                    Show Inventory
                  </Link>
                </li>
                <li>
                  <Link
                    to="/inventory-service/create"
                    className="block px-4 py-2 hover:bg-blue-600"
                  >
                    Create Order
                  </Link>
                </li>
                <li>
                  <Link
                    to="/inventory-service/add"
                    className="block px-4 py-2 hover:bg-blue-600"
                  >
                    Add Product
                  </Link>
                </li>
              </ul>
            </div>
          </li>

          {/* Orders */}
          <li>
            <Link
              to="/order-service"
              className="text-white hover:bg-blue-600 px-3 py-2 rounded transition"
            >
              Orders
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
