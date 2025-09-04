import { useState, useEffect } from "react";
import axios from "axios";
import { ShoppingCart } from "lucide-react"; 

const API_URL = "http://localhost:5003/api";

export default function MenuList() {
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/menus`).then((res) => setMenus(res.data));
  }, []);

  const addToCart = (menu) => {
    setCart((prev) => {
      const exists = prev.find((item) => item._id === menu._id);
      if (exists) {
        return prev.map((item) =>
          item._id === menu._id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...menu, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🍽 Digital Menu</h1>
        <button
          onClick={() => setShowCart(!showCart)}
          className="relative bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <ShoppingCart size={20} />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white w-5 h-5 flex items-center justify-center rounded-full">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* Menu Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {menus.map((menu) => (
          <div
            key={menu._id}
            className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition"
          >
            <img
              src={menu.image}
              alt={menu.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{menu.name}</h3>
              <p className="text-gray-600 mb-2">Rp {menu.price.toLocaleString()}</p>
              <button
                onClick={() => addToCart(menu)}
                className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
              >
                Tambah
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Popup */}
      {showCart && (
        <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-2xl border-l p-4 z-50">
          <h2 className="text-xl font-bold mb-4">🛒 Keranjang</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500">Keranjang kosong</p>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.qty} x Rp {item.price.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Hapus
                  </button>
                </div>
              ))}
              <div className="mt-4 font-bold text-lg">
                Total: Rp{" "}
                {cart
                  .reduce((sum, i) => sum + i.price * i.qty, 0)
                  .toLocaleString()}
              </div>
              <button className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition">
                Pesan Sekarang
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
