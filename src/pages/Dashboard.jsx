import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";
import AddEditProductModal from "../components/AddEditProductModal";
import { BadgeCent, Bolt, ClipboardList, LayoutDashboard, ListOrdered, LogOut, Mail, Search, ShieldQuestionMark, ShoppingBasket, SlidersHorizontal, SquarePen, SquarePercent, Trash2, Trello, Users, Warehouse, Workflow } from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/");
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://inventory-management-dashboard-backend-7tx4.onrender.com/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Error loading products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://inventory-management-dashboard-backend-7tx4.onrender.com/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    signOut(auth);
    navigate("/");
  };

  return (

    <div className="flex gap-2">

      <div className="w-[16%] border-r-1 ">
        <div className=" border-b-1 p-4 ">
          <p className="text-[#00C4A7] font-bold text-2xl flex gap-2 items-center justify-center">
            <img className="h-12 w-20" src="./logo2.png" alt="logo" />
            ByteDash
          </p>
        </div>
        <ul className=" leading-12 pl-4">
          <li className="flex items-center justify-start"><LayoutDashboard className="h-4" />Dashboard</li>
          <li className="flex items-center justify-start"><BadgeCent className="h-4" />Point of sale</li>
          <li className="flex items-center justify-start"><Mail className="h-4" />Messages </li>
          <li className="flex items-center justify-start"><ListOrdered className="h-4" />Orders</li>
          <li className="flex items-center justify-start"><Users className="h-4" />Customers</li>
          <li className="flex items-center justify-start"><SquarePercent className="h-4" />marketing</li>
          <li className="flex items-center justify-start"><ShieldQuestionMark className="h-4" />Support</li>
          <li className="flex items-center justify-start"><ClipboardList className="h-4" />Invoice</li>
          <li className="flex items-center justify-start"><Workflow className="h-4" />Integrations</li>
          <li className="flex items-center justify-start"><LogOut className="h-4" />Log Out</li>
          <li className="flex items-center justify-start"><Bolt className="h-4" />Settings</li>
        </ul>
      </div>

      <div className="p-4 w-[84%] min-h-screen ">
        <div className=" flex gap-4 place-self-center border-1 h-10 rounded-lg w-[40%]">
          <Search className="ml-3 w-6 flex place-self-center" />
          <input className="" type="text" placeholder="search anything..." />
        </div>

        <div className="border-t-1 flex justify-between items-center mb-6 mt-6 ">
          <h2 className="text-xl font-semibold  flex gap-4 pt-4">Inventory </h2>

          <div className="flex gap-2 pt-4 cursor-pointer">
            <div className=" flex gap-4 place-self-center border-1 h-10 rounded-lg w-[30%] ">
              <Search className="ml-2 w-4 flex place-self-center" />
              <input className="" type="text" placeholder="Search Product..." />
            </div>
            <div className=" flex gap-4 place-self-center border-1 h-10 rounded-lg w-[26%] ">
              <SlidersHorizontal className="ml-2 w-4 flex place-self-center" />
              <p className="place-items-center place-self-center cursor-pointer">Filter Result's</p>
            </div>
            <button
              onClick={() => {
                setSelectedProduct(null);
                setShowModal(true);
              }}
              className="bg-[#00C4A7] cursor-pointer font-semibold text-white px-4 py-2 rounded hover:bg-[#61adad]"
            >
              + Add Product
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 cursor-pointer flex justify-center items-center text-white px-4 py-2 rounded hover:bg-red-600"
            >
              <LogOut className="h-4" /> Logout
            </button>
          </div>
        </div>
        <div className="flex gap-6 items-center mb-6 rounded-lg bg-neutral-100 p-2 border border-gray-300">
          <p className="flex gap-2 justify-center items-center"><Warehouse className="h-4 " />Total Product's = {products.length} </p>
          <p className="flex gap-2 justify-center items-center"><Trello className="h-4 " />Brands Listed = 100+ </p>
          <p className="flex gap-2 justify-center items-center"><ShoppingBasket className="h-4 " />Product Listed 150+ </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto ">
          <table className="min-w-full bg-white rounded shadow">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Qty</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2">{p.quantity}</td>
                  <td className="px-4 py-2">{p.price}</td>
                  <td className="px-4 py-2">{p.category}</td>
                  <td className="px-4 py-2 space-x-2 flex ">
                    <button
                      onClick={() => {
                        setSelectedProduct(p);
                        setShowModal(true);
                      }}
                      className="bg-blue-500 flex cursor-pointer justify-center items-center text-white px-3 py-1 rounded"
                    >
                      <SquarePen className="h-4" />Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="bg-red-500 cursor-pointer flex justify-center items-center text-white px-3 py-1 rounded"
                    >
                      <Trash2 className="h-4" />Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td className="px-4 py-4 text-center text-gray-500" colSpan={5}>
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <AddEditProductModal
            product={selectedProduct}
            onClose={() => setShowModal(false)}
            refresh={fetchProducts}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
