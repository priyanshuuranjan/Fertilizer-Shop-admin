import { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import { ListRowSkeleton } from "../../components/Skeleton/Skeleton";

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/product/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("Error");
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (productId) => {
    const response = await axios.post(`${url}/api/product/remove`, {
      id: productId,
    });
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error("Error");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Products List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Size</b>
          <b>Price</b>
          
          <b>Action</b>
        </div>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <ListRowSkeleton key={i} />)
          : list.map((item, index) => {
          return (
            <div key={index} className="list-table-format">
              <img src={`${url}/images/` + item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{item.size}</p>
              <p>₹{item.price}</p>
              <p onClick={() => removeProduct(item._id)} className="cursor">
                X
              </p>
            </div>
          );
            })}
      </div>
    </div>
  );
};

export default List;
