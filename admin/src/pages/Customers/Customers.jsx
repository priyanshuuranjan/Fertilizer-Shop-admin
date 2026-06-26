import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Customers.css";

const Customers = ({ url }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("totalSpent");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${url}/api/customers/list`);
        if (res.data.success) setCustomers(res.data.data);
        else toast.error("Failed to load customers");
      } catch {
        toast.error("Server error");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [url]);

  const filtered = customers
    .filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <div className="customers-page">
      <h2 className="customers-title">Customers</h2>

      <div className="customers-toolbar">
        <input
          className="cust-search"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="cust-sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="totalSpent">Sort by Spent</option>
          <option value="orderCount">Sort by Orders</option>
        </select>
      </div>

      <div className="cust-table">
        <div className="cust-row cust-header">
          <span>#</span>
          <span>Name</span>
          <span>Email</span>
          <span>Orders</span>
          <span>Total Spent</span>
        </div>

        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="cust-row cust-skeleton" />
            ))
          : filtered.length === 0
          ? <p className="no-data">No customers found.</p>
          : filtered.map((c, i) => (
              <div key={c._id} className="cust-row">
                <span className="cust-num">{i + 1}</span>
                <span className="cust-name">{c.name}</span>
                <span className="cust-email">{c.email}</span>
                <span className="cust-badge">{c.orderCount}</span>
                <span className="cust-spent">₹{c.totalSpent.toLocaleString()}</span>
              </div>
            ))}
      </div>

      {!loading && (
        <p className="cust-count">
          Showing {filtered.length} of {customers.length} customers
        </p>
      )}
    </div>
  );
};

export default Customers;
