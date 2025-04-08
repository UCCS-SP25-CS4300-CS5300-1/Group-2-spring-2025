import React, { useState, useEffect } from 'react';
import './barcodeHistory.css';

const API_URL = import.meta.env.VITE_DJANGO_BASE_URL;

// Function to fetch scanned items from the Django backend
const fetchScannedItems = async () => {
    try {
        const csrfToken = localStorage.getItem("token");
        console.log("token sent to fetch scanned items: ", csrfToken);
        const response = await fetch(`${API_URL}/user-scanned-items/`, {
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching scanned items:', error);
        return [];
    }
};

// Function to delete a scanned item
const deleteScannedItem = async (id) => {
    try {
        const csrfToken = localStorage.getItem("token");
        console.log("token sent to delete scanned item: ", csrfToken);
        await fetch(`${API_URL}/user-scanned-items/${id}/`, {
            method: 'DELETE',
            credentials: "include",
            headers: {
                "X-CSRFToken": csrfToken,
            }
        });
    } catch (error) {
        console.error('Error deleting scanned item:', error);
    }
};

// Function to update a scanned item (e.g., toggle favorite)
const updateScannedItem = async (id, data) => {
    try {
        const csrfToken = localStorage.getItem("token");
        console.log("token sent to update scanned item: ", csrfToken);
        const response = await fetch(`${API_URL}/user-scanned-items/${id}/`, {
            method: 'PATCH',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating scanned item:', error);
        return null;
    }
};

function BarcodeHistory() {
    const [scannedItems, setScannedItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch scanned items on mount
    useEffect(() => {
        const fetchItems = async () => {
            const data = await fetchScannedItems();
            setScannedItems(data);
            setLoading(false);
        };

        fetchItems();
    }, []);

    // Handle deletion: update the state after deleting the item on the server
    const handleDelete = async (id) => {
        await deleteScannedItem(id);
        setScannedItems(scannedItems.filter(item => item.id !== id));
    };

    // Handle toggling the favorite flag using the PATCH endpoint
    const handleFavoriteToggle = async (id, favorite) => {
        // Send a PATCH request with the toggled favorite state
        const updatedItem = await updateScannedItem(id, { favorite: !favorite });
        if (updatedItem) {
            setScannedItems(scannedItems.map(item =>
                item.id === id ? updatedItem : item
            ));
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
                            {item.favorite ? 'Unfavorite' : 'Favorite'}
                        </button>
                        <button className="delete-btn" onClick={() => handleDelete(item.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
            <div className="button-group">
                <button className="account-btn">Account</button>
                <button className="signup-btn">Sign Up</button>
            </div>
            <div className="bottom-links">
                <a className="faq-btn" href="/#/contact">FAQ</a>
                <a className="about-btn" href="/#/about">About</a>
            </div>
        </div>
    );
}

export default BarcodeHistory;
