import { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import { ListRowSkeleton } from "../../components/Skeleton/Skeleton";

const List = ({ url, isSuperAdmin }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditValue(String(item.stock ?? 0));
  };

  const saveStock = async (productId) => {
    const trimmed = String(editValue).trim();
    const qty = Number(trimmed);
    if (trimmed === "" || !Number.isFinite(qty) || qty < 0) {
      toast.error("Enter a valid stock number (0 or more)");
      return;
    }
    try {
      const res = await axios.post(`${url}/api/product/update-stock`, {
        id: productId,
        stock: qty,
      });
      if (res.data.success) {
        setList((prev) =>
          prev.map((p) =>
            p._id === productId ? { ...p, stock: res.data.stock } : p
          )
        );
        setEditingId(null);
        toast.success("Stock updated");
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (err) {
      // Surface the real reason instead of a generic message — a 404 here
      // usually means the backend serving this panel doesn't have the route yet.
      if (err.response?.status === 404) {
        toast.error("Endpoint not found — restart/redeploy the backend");
      } else {
        toast.error(
          err.response?.data?.message ||
            `Request failed${err.response ? ` (${err.response.status})` : " (no response)"}`
        );
      }
    }
  };

  const fetchList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/product/list`);
      if (response.data.success) {
        setList(response.data.data);
        setSelected(new Set());
      } else {
        toast.error("Error loading products");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (productId) => {
    if (!isSuperAdmin) return;
    try {
      const response = await axios.post(`${url}/api/product/remove`, { id: productId });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message || "Error");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === list.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(list.map((p) => p._id)));
    }
  };

  const bulkDelete = async () => {
    if (!isSuperAdmin || selected.size === 0) return;
    if (!window.confirm(`Delete ${selected.size} selected product(s)?`)) return;
    setBulkLoading(true);
    try {
      const res = await axios.post(`${url}/api/product/bulk-remove`, {
        ids: Array.from(selected),
      });
      if (res.data.success) {
        toast.success(res.data.message);
        await fetchList();
      } else {
        toast.error("Bulk delete failed");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setBulkLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const allSelected = list.length > 0 && selected.size === list.length;

  return (
    <div className="list add flex-col">
      <div className="list-header">
        <p>All Products List</p>
        {isSuperAdmin && selected.size > 0 && (
          <button
            className="bulk-delete-btn"
            onClick={bulkDelete}
            disabled={bulkLoading}
          >
            {bulkLoading ? "Deleting..." : `Delete Selected (${selected.size})`}
          </button>
        )}
      </div>

      <div className="list-table">
        <div className="list-table-format title">
          {isSuperAdmin ? (
            <input
              type="checkbox"
              className="row-check"
              checked={allSelected}
              onChange={toggleSelectAll}
            />
          ) : (
            <span />
          )}
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Size</b>
          <b>Price</b>
          <b>Stock</b>
          <b>Action</b>
        </div>

        {loading
          ? Array.from({ length: 6 }).map((_, i) => <ListRowSkeleton key={i} />)
          : list.map((item, i) => (
              <div
                key={item._id}
                className={`list-table-format ${selected.has(item._id) ? "row-selected" : ""}`}
                style={{ "--i": Math.min(i, 10) }}
              >
                {isSuperAdmin ? (
                  <input
                    type="checkbox"
                    className="row-check"
                    checked={selected.has(item._id)}
                    onChange={() => toggleSelect(item._id)}
                  />
                ) : (
                  <span />
                )}
                <img src={`${url}/images/${item.image}`} alt="" />
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>{item.size}</p>
                <p>₹{item.price}</p>
                <p>
                  {editingId === item._id ? (
                    <span className="stock-edit">
                      <input
                        type="number"
                        min="0"
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveStock(item._id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                      />
                      <button onClick={() => saveStock(item._id)} title="Save">
                        ✓
                      </button>
                    </span>
                  ) : (
                    <span
                      className={`stock-badge editable ${
                        (item.stock ?? 0) === 0
                          ? "out"
                          : item.stock <= 10
                          ? "low"
                          : "in"
                      }`}
                      onClick={() => startEdit(item)}
                      title="Click to edit stock"
                    >
                      {(item.stock ?? 0) === 0 ? "Out" : item.stock}
                    </span>
                  )}
                </p>
                {isSuperAdmin ? (
                  <p
                    onClick={() => removeProduct(item._id)}
                    className="cursor remove-btn"
                  >
                    X
                  </p>
                ) : (
                  <p />
                )}
              </div>
            ))}
      </div>
    </div>
  );
};

export default List;
