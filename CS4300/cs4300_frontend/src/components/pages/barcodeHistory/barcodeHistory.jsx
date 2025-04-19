// src/components/barcodeHistory/BarcodeHistory.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './barcodeHistory.css';

const API_URL = import.meta.env.VITE_DJANGO_BASE_URL;

async function fetchScannedItems() {
    try {
        const csrfToken = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/user-scanned-items/`, {
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
            }
        });
        if (!res.ok) throw new Error('Failed to fetch');
        return await res.json();
    } catch (err) {
        console.error("fetchScannedItems:", err);
        return [];
    }
}

async function deleteScannedItem(id) {
    try {
        const csrfToken = localStorage.getItem("token");
        await fetch(`${API_URL}/user-scanned-items/${id}/`, {
            method: 'DELETE',
            credentials: "include",
            headers: { "X-CSRFToken": csrfToken }
        });
    } catch (err) {
        console.error("deleteScannedItem:", err);
    }
}

async function updateScannedItem(id, data) {
    try {
        const csrfToken = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/user-scanned-items/${id}/`, {
            method: 'PATCH',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
            },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to update');
        return await res.json();
    } catch (err) {
        console.error("updateScannedItem:", err);
        return null;
    }
}

export default function BarcodeHistory() {
    const [scannedItems, setScannedItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // load list on mount
    useEffect(() => {
        (async () => {
            const items = await fetchScannedItems();
            setScannedItems(items);
            setLoading(false);
        })();
    }, []);

    const handleDelete = async (id) => {
        await deleteScannedItem(id);
        setScannedItems(prev => prev.filter(item => item.id !== id));
    };

    const handleFavoriteToggle = async (id, favorite) => {
        const updated = await updateScannedItem(id, { favorite: !favorite });
        if (updated) {
            setScannedItems(prev =>
                prev.map(item => item.id === id ? updated : item)
            );
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="scanned-items-app">
            <h2>Scanned Items</h2>
            <ul className="scanned-items-list">
                {scannedItems.map(item => (
                    <li key={item.id} className="scanned-item">
                        <span>{item.name} - {item.barcode}</span>

                        <button
                            className="favorite-btn"
                            onClick={() => handleFavoriteToggle(item.id, item.favorite)}
                        >
                            {item.favorite ? '★ Unfavorite' : '☆ Favorite'}
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
                    </li>
                ))}
            </ul>

            <div className="bottom-links">
                <Link to="/contact" className="faq-btn">FAQ</Link>
                <Link to="/about" className="about-btn">About</Link>
            </div>
        </div>
    );
}
