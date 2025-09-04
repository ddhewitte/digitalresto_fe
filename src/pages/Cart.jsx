import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export default function Cart() {
  const location = useLocation();
  const navigate = useNavigate();
  const [cart, setCart] = useState(location.state?.cart || []);
  const [tableNumber, setTableNumber] = useState("");

  const checkout = async () => {
    await axios.post(`${API_URL}/orders`, {
      tableNumber,
      items: cart.map(c => ({ menuId: c._id, name: c.name, qty: c.qty, price: c.price }))
    });
    navigate(`/status/${tableNumber}`);
  };

  return (
    <div>
      <h1>Cart</h1>
      {cart.map((c, i) => (
        <div key={i}>
          {c.name} x {c.qty} = Rp {c.price * c.qty}
        </div>
      ))}
      <input 
        placeholder="Table Number"
        value={tableNumber}
        onChange={e => setTableNumber(e.target.value)}
      />
      <button onClick={checkout}>Checkout</button>
    </div>
  );
}
