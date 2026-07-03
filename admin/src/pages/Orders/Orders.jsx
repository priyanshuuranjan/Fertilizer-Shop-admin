import { useEffect, useState } from "react";
import "./Orders.css";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../assets/assets";
import { OrderCardSkeleton } from "../../components/Skeleton/Skeleton";
import PrintSlip from "../../components/PrintSlip/PrintSlip";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [printOrder, setPrintOrder] = useState(null);

  // Mount the slip off-screen, fire the browser print dialog, then unmount
  // once it closes — a packing slip straight from the browser, no PDF download.
  useEffect(() => {
    if (!printOrder) return;
    const cleanup = () => setPrintOrder(null);
    window.addEventListener("afterprint", cleanup);
    const timer = setTimeout(() => window.print(), 80);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("afterprint", cleanup);
    };
  }, [printOrder]);

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(url + "/api/order/list");
      if (response.data.success) setOrders(response.data.data);
      else toast.error("Error");
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(url + "/api/order/status", {
      orderId,
      status: event.target.value,
    });
    if (response.data.success) await fetchAllOrders();
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await axios.get(`${url}/api/order/export`, {
        responseType: "blob",
      });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", "orders-export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Orders exported successfully");
    } catch {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order add">
      <div className="orders-header">
        <h3>Order Page</h3>
        <button
          className="export-btn"
          onClick={handleExport}
          disabled={exporting}
        >
          {exporting ? "Exporting..." : "Export CSV"}
        </button>
      </div>

      <div className="order-list">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <OrderCardSkeleton key={i} />
            ))
          : orders.map((order, index) => (
              <div
                key={index}
                className="order-item"
                style={{ "--i": Math.min(index, 8) }}
              >
                <img src={assets.parcel_icon} alt="" />
                <div>
                  <p className="order-item-product">
                    {order.items.map((item, index) => {
                      if (index === order.items.length - 1) {
                        return item.name + " x " + item.quantity;
                      } else {
                        return item.name + " x " + item.quantity + ", ";
                      }
                    })}
                  </p>
                  <p className="order-item-name">
                    {order.address.firstName + " " + order.address.lastName}
                  </p>
                  <div className="order-item-address">
                    <p>{order.address.street + ","}</p>
                    <p>
                      {order.address.city +
                        ", " +
                        order.address.state +
                        ", " +
                        order.address.country +
                        ", " +
                        order.address.zipcode}
                    </p>
                  </div>
                  <p className="order-item-phone">{order.address.phone}</p>
                </div>
                <p>Items : {order.items.length}</p>
                <p>₹{order.amount}</p>
                <div className="order-item-actions">
                  <select
                    onChange={(event) => statusHandler(event, order._id)}
                    value={order.status}
                  >
                    <option value="Order Confirmed">Order Confirmed</option>
                    <option value="Order Shipped">Order Shipped</option>
                    <option value="Out for delivery">Out For Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  <button
                    className="print-order-btn"
                    onClick={() => setPrintOrder(order)}
                    title="Print packing slip"
                  >
                    <span className="print-icon">🖨️</span> Print
                  </button>
                </div>
              </div>
            ))}
      </div>

      <PrintSlip order={printOrder} />
    </div>
  );
};

export default Orders;
