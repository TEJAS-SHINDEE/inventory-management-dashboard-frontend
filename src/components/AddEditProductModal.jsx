import { useState, useEffect } from "react";
import axios from "axios";

function AddEditProductModal({ product, onClose, refresh }) {
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    price: "",
    category: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        quantity: product.quantity,
        price: product.price,
        category: product.category,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = product
      ? `https://inventory-management-dashboard-backend-7tx4.onrender.com/api/products/${product._id}`
      : "https://inventory-management-dashboard-backend-7tx4.onrender.com/api/products";

    const method = product ? "put" : "post";

    try {
      await axios[method](url, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      refresh();
      onClose();
    } catch (err) {
      alert("Failed to save product");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative">
        <h2 className="text-xl font-bold mb-4">
          {product ? "Edit Product" : "Add Product"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {product ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEditProductModal;
