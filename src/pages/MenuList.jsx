import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

export default function MenuList() {
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/menus`).then(res => setMenus(res.data));
  }, []);

  const addToCart = (menu) => {
    setCart(prev => [...prev, { ...menu, qty: 1 }]);
  };

  return (
    <div>
      <h1>Digital Menu</h1>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {menus.map(menu => (
          <div key={menu._id} style={{ border: "1px solid #ddd", padding: "1rem" }}>
            <img src={menu.image} width="100" />
            <h3>{menu.name}</h3>
            <p>Rp {menu.price}</p>
            <button onClick={() => addToCart(menu)}>Add</button>
          </div>
        ))}
      </div>
      <Link to="/cart" state={{ cart }}>Go to Cart ({cart.length})</Link>
    </div>
  );
}
