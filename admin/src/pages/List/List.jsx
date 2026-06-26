import { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import { ListRowSkeleton } from "../../components/Skeleton/Skeleton";

const List = ({ url }) => {
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
    const qty = Number(editValue);
    if (!Number.isFinite(qty) || qty < 0) {
      toast.error("Enter a valid stock number");
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
        toast.success("Stock updated");
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setEditingId(null);
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
    const response = await axios.post(`${url}/api/product/remove`, { id: productId });
    await fetchList();
    if (response.data.success) toast.success(response.data.message);
    else toast.error("Error");
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
    if (selected.size === 0) return;
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
        {selected.size > 0 && (
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
          <input
            type="checkbox"
            className="row-check"
            checked={allSelected}
            onChange={toggleSelectAll}
          />
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
          : list.map((item) => (
              <div
                key={item._id}
                className={`list-table-format ${selected.has(item._id) ? "row-selected" : ""}`}
              >
                <input
                  type="checkbox"
                  className="row-check"
                  checked={selected.has(item._id)}
                  onChange={() => toggleSelect(item._id)}
                />
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
                <p
                  onClick={() => removeProduct(item._id)}
                  className="cursor remove-btn"
                >
                  X
                </p>
              </div>
            ))}
      </div>
    </div>
  );
};

export default List;
