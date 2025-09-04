import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export default function OrderStatus() {
  const { tableNumber } = useParams();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get(`${API_URL}/orders/${tableNumber}`).then(res => setOrders(res.data));
    }, 3000);
    return () => clearInterval(interval);
  }, [tableNumber]);

  return (
    <div>
      <h1>Order Status (Table {tableNumber})</h1>
      {orders.map(o => (
        <div key={o._id}>
          Order #{o._id.slice(-4)} - Status: {o.status}
        </div>
      ))}
    </div>
  );
}
