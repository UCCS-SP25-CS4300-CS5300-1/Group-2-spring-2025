import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./barcodeHistory.css";

const API_URL = import.meta.env.VITE_DJANGO_BASE_URL;

let delDeb = false;

const fetchScannedItems = async () => {
  try {
    const csrfToken = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/user-scanned-items/`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch");
    return await response.json();
  } catch (error) {
    console.error("fetchScannedItems:", error);
    return [];
  }
};

const deleteScannedItem = async (id) => {
  if (delDeb) return;
  delDeb = true;
  try {
    const csrfToken = localStorage.getItem("token");
    await fetch(`${API_URL}/user-scanned-items/${id}/`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "X-CSRFToken": csrfToken,
      },
    });
    delDeb = false;
  } catch (error) {
    delDeb = false;
    console.error("deleteScannedItem:", error);
  }
};

const updateScannedItem = async (id, data) => {
  try {
    const csrfToken = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/user-scanned-items/${id}/`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update");
    return await response.json();
  } catch (error) {
    console.error("updateScannedItem:", error);
    return null;
  }
};

export default function BarcodeHistory() {
  const [scannedItems, setScannedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const items = await fetchScannedItems();
      setScannedItems(items);
      setLoading(false);
    })();
  }, []);

  const handleDelete = async (id) => {
    await deleteScannedItem(id);
    setScannedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleFavoriteToggle = async (id, favorite) => {
    const updatedItem = await updateScannedItem(id, { favorite: !favorite });
    if (updatedItem) {
      setScannedItems((prev) =>
        prev.map((item) => (item.id === id ? updatedItem : item))
      );
    }
  };

  if (loading) return <div className="page-container">Loading...</div>;

  return (
    <div className="page-container scanned-items-app">
      <h2>Scanned Items</h2>
      <ul className="scanned-items-list">
        {scannedItems.map((item) => (
          <li key={item.id} className="scanned-item">
            <span>{item.name} - {item.barcode}</span>
            <div className="item-actions">
              <button
                className="favorite-btn"
                onClick={() => handleFavoriteToggle(item.id, item.favorite)}
              >
                {item.favorite ? "★ Unfavorite" : "☆ Favorite"}
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
              {item.barcode && (
                <Link
                  to="/compare"
                  state={{ leftBarcode: item.barcode }}
                  className="compare-btn"
                >
                  Compare
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="button-group">
        <button className="account-btn" onClick={() => navigate("/account")}>
          Account
        </button>
      </div>

      <div className="bottom-links">
        <Link className="faq-btn" to="/contact">FAQ</Link>
        <Link className="about-btn" to="/about">About</Link>
      </div>
    </div>
  );
}
