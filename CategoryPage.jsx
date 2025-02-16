import { useEffect, useState } from "react";

export default function CategoryPage() {
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [categoryID, setCategoryID] = useState(null); // For update
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await fetch("http://localhost:5226/api/Category/GetAll");
            if (!response.ok) throw new Error("Failed to fetch categories");
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            alert("Error fetching categories");
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Open the modal for adding or editing
    const openModal = (category = null) => {
        if (category) {
            setCategoryID(category.categoryID);
            setCategoryName(category.categoryName);
        } else {
            setCategoryID(null);
            setCategoryName("");
        }
        setIsModalOpen(true);
    };

    // Handle form submission for Add/Update
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!categoryName.trim()) {
            alert("Category name is required");
            return;
        }
    
        try {
            const payload = { categoryID, categoryName }; // Ensure ID is sent
            const url = categoryID
                ? `http://localhost:5226/api/Category/Update/${categoryID}`
                : "http://localhost:5226/api/Category/Create";
            const method = categoryID ? "PUT" : "POST";
    
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
    
            const data = await response.json();
    
            if (!response.ok) throw new Error(data.message || "Update failed");
    
            alert(categoryID ? "Category updated successfully!" : "Category added successfully!");
            fetchCategories();
            setIsModalOpen(false);
        } catch (error) {
            alert("Error: " + error.message);
        }
    };
    
    

    // Delete a category
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            const response = await fetch(`http://localhost:5226/api/Category/Delete/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete category");

            alert("Category deleted successfully!");
            fetchCategories();
        } catch (error) {
            alert("Error deleting category");
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Manage Categories</h2>
            <button onClick={() => openModal()} style={styles.addButton}>+ Add Category</button>

            {/* Categories Table */}
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Category Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <tr key={category.categoryID}>
                                    <td>{category.categoryID}</td>
                                    <td>{category.categoryName}</td>
                                    <td>
                                        <button onClick={() => openModal(category)} style={styles.editButton}>Edit</button>
                                        <button onClick={() => handleDelete(category.categoryID)} style={styles.deleteButton}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" style={styles.noData}>No categories found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal for Add/Edit */}
            {isModalOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h3>{categoryID ? "Edit Category" : "Add Category"}</h3>
                        <form onSubmit={handleSubmit}>
                            <label style={styles.label}>Category Name:</label>
                            <input
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                style={styles.input}
                                required
                            />
                            <div style={styles.buttonGroup}>
                                <button type="submit" style={styles.saveButton}>{categoryID ? "Update" : "Save"}</button>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={styles.cancelButton}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// Styles
const styles = {
    container: {
        maxWidth: "900px",
        margin: "2rem auto",
        padding: "2rem",
        backgroundColor: "#2A2D3E",
        borderRadius: "12px",
        color: "#F1FAEE",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    },
    heading: {
        textAlign: "center",
        marginBottom: "1rem",
        fontSize: "2rem",
    },
    addButton: {
        backgroundColor: "#E63946",
        color: "white",
        padding: "0.7rem 1.5rem",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        display: "block",
        margin: "0 auto 1rem",
        transition: "0.3s",
    },
    tableContainer: {
        overflowX: "auto",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        textAlign: "center",
    },
    editButton: {
        backgroundColor: "#A8DADC",
        color: "#1E1E2E",
        border: "none",
        padding: "0.5rem 1rem",
        marginRight: "5px",
        borderRadius: "6px",
        cursor: "pointer",
        transition: "0.3s",
    },
    deleteButton: {
        backgroundColor: "#E63946",
        color: "white",
        border: "none",
        padding: "0.5rem 1rem",
        borderRadius: "6px",
        cursor: "pointer",
        transition: "0.3s",
    },
    noData: {
        textAlign: "center",
        padding: "1rem",
        fontSize: "1.2rem",
        color: "#A8DADC",
    },
    modalOverlay: {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    modal: {
        backgroundColor: "#2A2D3E",
        padding: "2rem",
        borderRadius: "8px",
        width: "400px",
        textAlign: "center",
    },
    input: {
        width: "100%",
        padding: "0.5rem",
        marginBottom: "1rem",
        border: "1px solid #A8DADC",
        borderRadius: "6px",
    },
    buttonGroup: {
        display: "flex",
        justifyContent: "space-between",
    },
    saveButton: {
        backgroundColor: "#A8DADC",
        color: "#1E1E2E",
        border: "none",
        padding: "0.7rem 1.5rem",
        borderRadius: "6px",
        cursor: "pointer",
    },
    cancelButton: {
        backgroundColor: "#E63946",
        color: "white",
        border: "none",
        padding: "0.7rem 1.5rem",
        borderRadius: "6px",
        cursor: "pointer",
    },
};

