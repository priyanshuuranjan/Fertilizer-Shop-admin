import { useState } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const Add = ({ url }) => {
  // to get the backend data
  // const url = "http://localhost:8000"; -> now i pass the url through app.jsx as props

  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    size: "",
    category: "Fertilizer",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("size", data.size);
    formData.append("image", image);
    const response = await axios.post(`${url}/api/product/add`, formData);
    if (response.data.success) {
      setData({
        name: "",
        description: "",
        price: "",
        category: "",
      });
      setImage(false);
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              className="image"
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </div>
        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Type here"
          />
        </div>
        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Write content here"
            required
          ></textarea>
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select
              className="selectt"
              onChange={onChangeHandler}
              name="category"
              value={data.category}
            >
              <option value="Fertilizer">Fertilizer</option>
              {""}
              <option value="Fungicides">Fungicides</option>
              {""}
              <option value="Vegetable Seeds">Vegetable Seeds</option>
              {""}
              <option value="Herbicide">Herbicide</option>
              {""}
              <option value="Farm Machinery">Farm Machinery</option>
              {""}
              <option value="Nutrients">Nutrients</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product Size</p>
            <input
              className="inputclasa"
              onChange={onChangeHandler}
              value={data.size}
              type="text"
              name="size"
              placeholder="Size (gm, ml, L)"
              required
            />
          </div>
          <div className="add-price flex-col">
            <p>Product Price</p>
            <input
              className="inputclasa"
              onChange={onChangeHandler}
              value={data.price}
              type="Number"
              name="price"
              placeholder="₹200"
              required
            />
          </div>
        </div>
        <button type="submit" className="add-btn">
          ADD
        </button>
      </form>
    </div>
  );
};

export default Add;
