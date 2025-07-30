import React, { useState, useEffect } from "react";
import $ from "jquery";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem("quotationItems");
    return stored ? JSON.parse(stored) : [];
  });
  const [newItem, setNewItem] = useState({ desc: "", qty: 1, price: 0 });
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("quotationItems", JSON.stringify(items));
  }, [items]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: name === "desc" ? value : +value });
  };

  const handleAdd = () => {
    if (newItem.desc && newItem.qty > 0 && newItem.price >= 0) {
      setItems([...items, newItem]);
      setNewItem({ desc: "", qty: 1, price: 0 });
    }
  };

  const handleDelete = (index) => {
    if (window.confirm("Delete this item?")) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setNewItem(items[index]);
    $("#desc").focus();
  };

  const handleSaveEdit = () => {
    const updated = [...items];
    updated[editingIndex] = newItem;
    setItems(updated);
    setEditingIndex(null);
    setNewItem({ desc: "", qty: 1, price: 0 });
  };

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <div className="container mt-5 ">
      <h2 className="mb-4">Quotation</h2>

      <div className="row g-2 mb-3">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Description"
            name="desc"
            id="desc"
            value={newItem.desc}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-1 d-flex justify-content-center align-items-center">
        Qty
        </div>
        <div className="col-md-1">
          <input
            type="number"
            className="form-control"
            placeholder="Qty"
            name="qty"
            min="1"
            value={newItem.qty}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-1 d-flex justify-content-center align-items-center">
        Price
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Price"
            name="price"
            min="0"
            value={newItem.price}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2">
          {editingIndex !== null ? (
            <button className="btn btn-warning w-100" onClick={handleSaveEdit}>
              Save
            </button>
          ) : (
            <button className="btn btn-primary w-100" onClick={handleAdd}>
              Add
            </button>
          )}
        </div>
      </div>

      {items.length > 0 ? (
        <>
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Description</th>
                <th style={{ width: "80px" }}>Qty</th>
                <th style={{ width: "100px" }}>Price</th>
                <th style={{ width: "100px" }}>Total</th>
                <th style={{ width: "120px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td>{item.desc}</td>
                  <td>{item.qty}</td>
                  <td>{item.price.toFixed(2)}</td>
                  <td>{(item.qty * item.price).toFixed(2)}</td>
                  <td>
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-warning" onClick={() => handleEdit(i)}>Edit</button>
            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(i)}>Delete</button>
          </div>
        </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-end mt-3">
            <h4>Total: {subtotal.toFixed(2)}</h4>
          </div>
        </>
      ) : (
        <p className="text-muted">No items</p>
      )}
    </div>
  );
}

export default App;
