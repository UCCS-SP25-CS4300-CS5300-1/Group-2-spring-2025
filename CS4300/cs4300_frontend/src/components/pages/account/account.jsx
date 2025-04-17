import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./account.css";
import {getCSRFToken} from "../../utils/auth_utils.jsx";

const API_URL = import.meta.env.VITE_DJANGO_BASE_URL;

// this CSRF token shouldnt work but it doesnt and I dont wanna break it
const saveAllergen = async (allergen) => {
    try {
        const csrfToken = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/add-allergen/`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
            },
            body: JSON.stringify({ allergen: allergen }),
        });
        if (!response.ok) {
            throw new Error("Failed to save allergen");
        }
        const data = await response.json();
        console.log("Saved allergen:", data);
        return data;
    } catch (error) {
        console.error("Error saving allergen:", error);
        return null;
    }
};

const getAllergens = async () => {
    try {
        const csrfToken = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/user-allergens/`, {
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
        console.error(error);
        return [];
    }
};

const deleteAllergen = async (id) => {
    try {
        const csrfToken = localStorage.getItem("token");
        await fetch(`${API_URL}/user-allergens/`, {
            method: 'DELETE',
            credentials: "include",
            headers: {
                "X-CSRFToken": csrfToken,
            }
        });
    } catch (error) {
        console.error(error);
    }
};


function Account() {
    const [inputValue, setInputValue] = useState("");
    const [allergens, setAllergens] = useState([]);
    const [loading, setLoading] = useState(true);

    const inputChange = (event) => {
        setInputValue(event.target.value);
    };

    useEffect(() => {
        const fetchItems = async () => {
            const data = await getAllergens();
            setAllergens(data);
            setLoading(false);
        };

        fetchItems();
    }, []);

    const Allergenclicked = async () => {
        if (!inputValue.trim()) {
            alert("Please enter an allergen.");
            return;
        }
        try {
            await saveAllergen(inputValue);
            const data = await getAllergens();
            setAllergens(data);
        } catch (err) {
            console.error("Error saving allergen ", err);
        }
    };

    const allergydelete = async (id) => {
        await deleteAllergen(id);
        setAllergens(allergens.filter(item => item.allergen !== id));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
            <div className="allergens-app">
                <h2>Allergies</h2>
                <ul className="allergens-list">
                    {allergens.map(item => (
                        <li key={item.allergen} className="allergen">
                            <span>{item.allergen}</span>
                            <button className="delete-btn" onClick={() => allergydelete(item.allergen)}>
                                Delete
                            </button>
                        </li>
                    ))} 
                </ul>
                <div className="allergen-input-group">
                <div></div>
                <label htmlFor="allergen-input">Input Allergen</label>
                <input
                    type="text"
                    id="allergen-text"
                    placeholder="Enter Allergen"
                    onChange={inputChange}
                />
                </div>
                <button className="add-btn" onClick={Allergenclicked}>
                Add Allergen
                </button>
                <div className="bottom-links">
                    <Link className="faq-btn" to="/contact">FAQ</Link>
                    <Link className="about-btn" to="/about">About</Link>
                </div>
            </div>
        );
}

export default Account;
