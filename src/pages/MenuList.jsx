import { useState, useEffect } from "react";
import axios from "axios";
import { ShoppingCart, X } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function MenuList() {
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [tableNumber, setTableNumber] = useState("");
  const [orders, setOrders] = useState([]); // ✅ state antrian

  useEffect(() => {
    axios.get(`${API_URL}/menus`).then((res) => setMenus(res.data));
  }, []);

  const addToCart = (menu) => {
    const qty = quantities[menu._id] || 1;
    if (qty <= 0) return;

    setCart((prev) => {
      const exists = prev.find((item) => item._id === menu._id);
      if (exists) {
        return prev.map((item) =>
          item._id === menu._id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { ...menu, qty }];
    });
    setQuantities((prev) => ({ ...prev, [menu._id]: 1 }));
  };

  const updateQty = (id, delta) => {
    setQuantities((prev) => {
      const current = prev[id] || 1;
      const newQty = Math.max(1, current + delta);
      return { ...prev, [id]: newQty };
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Keranjang masih kosong!");
    if (!tableNumber) return alert("Harap isi nomor meja!");

    try {
      const orderData = {
        tableNumber,
        items: cart,
        total: cart.reduce((sum, i) => sum + i.price * i.qty, 0),
        status: "Menunggu", // ✅ status default
      };

      // simpan ke state orders
      setOrders((prev) => [...prev, orderData]);

      console.log("Pesanan dikirim:", orderData);
      alert(`Pesanan untuk Meja ${tableNumber} berhasil dikirim!`);

      // reset
      setCart([]);
      setQuantities({});
      setTableNumber("");
      setShowCart(false);
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim pesanan!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#b30707] via-red-800 to-black p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">
          Digital Menu | ABC Nasi Goreng
        </h1>
        <button
          onClick={() => setShowCart(true)}
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

      {/* Orders Queue */}
      {orders.length > 0 && (
        <div className="overflow-hidden whitespace-nowrap bg-yellow-100 border border-yellow-300 rounded-lg p-2 mb-6">
          <div className="animate-marquee inline-block">
            {orders.map((order, idx) => (
              <span
                key={idx}
                className="mx-6 text-sm font-medium text-gray-800"
              >
                🪑 Meja {order.tableNumber} — {order.status}
              </span>
            ))}
          </div>
        </div>
      )}

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
              <h3 className="text-lg font-semibold text-gray-800">
                {menu.name}
              </h3>
              <p className="text-gray-600 mb-2">
                Rp {menu.price.toLocaleString()}
              </p>

              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => updateQty(menu._id, -1)}
                  className="px-3 py-1 rounded-lg border border-gray-400"
                >
                  -
                </button>
                <input
                  type="text"
                  value={quantities[menu._id] || 1}
                  readOnly
                  className="w-12 text-center border text-black border-black bg-white rounded-lg"
                />
                <button
                  onClick={() => updateQty(menu._id, +1)}
                  className="px-3 py-1 rounded-lg border border-gray-400"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => addToCart(menu)}
                className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
              >
                Tambah Pesanan
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Overlay */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
          <div className="w-80 h-full bg-white shadow-2xl p-4 animate-slideIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-700">🛒 Pesanan</h2>
              <button onClick={() => setShowCart(false)}>
                <X size={24} />
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="text-gray-500">- Pesanan anda masih kosong -</p>
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

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Meja
                  </label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Masukkan nomor meja..."
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                  />
                </div>

                <div className="mt-4 font-bold text-lg">
                  Total: Rp{" "}
                  {cart
                    .reduce((sum, i) => sum + i.price * i.qty, 0)
                    .toLocaleString()}
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
                >
                  Pesan Sekarang
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
