import { useEffect, useState } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2

import { useNavigate, useParams } from "react-router-dom";

const styles = {
    container: {
        backgroundColor: "#fff",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        maxWidth: "800px",
        margin: "2rem auto",
    },
    header: {
        fontSize: "1.5rem",
        fontWeight: "600",
        marginBottom: "2rem",
        color: "#2d3748",
    },
    label: {
        display: "block",
        marginBottom: "0.5rem",
        fontWeight: "500",
        color: "#4a5568",
    },
    input: {
        width: "100%",
        padding: "0.75rem",
        marginBottom: "1.5rem",
        border: "1px solid #e2e8f0",
        borderRadius: "6px",
        fontSize: "1rem",
        transition: "border-color 0.2s",
    },
    imagePreview: {
        width: "100%",
        maxWidth: "300px",
        height: "200px",
        objectFit: "cover",
        borderRadius: "8px",
        marginBottom: "1rem",
        border: "2px dashed #e2e8f0",
    },
    button: {
        width: "100%",
        padding: "0.75rem",
        fontWeight: "600",
        borderRadius: "6px",
        cursor: "pointer",
        transition: "opacity 0.2s",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "1rem",
    },
};

export default function Adminform() {
    const params = useParams();
    const nav = useNavigate();
    const [item, setItem] = useState({ 
        categoryID: 1,
        name: "", 
        description: "", 
        price: 0
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://localhost:5226/api/Category/GetAll");
                if (!response.ok) throw new Error('Failed to fetch categories');
                const data = await response.json();
                console.log('Fetched categories:', data); // Debugging line
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                alert('Failed to load categories');
            }
        };

        fetchCategories();
    }, [])

    useEffect(() => {
        if (params.id !== "0") {
            fetch(`http://localhost:5226/api/Menu/GetById/${params.id}`)
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch');
                    return res.json();
                })
                .then(res => {
                    setItem({
                        categoryID: res.categoryID,
                        name: res.name,
                        description: res.description,
                        price: res.price
                    });
                    setImagePreview(res.imageURL);
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                    alert('Failed to load item data');
                    nav("/admin");
                });
        }
    }, [params.id, nav]);


const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!item.name?.trim()) {
        Swal.fire("Error", "Name is required", "error");
        return;
    }
    if (!item.description?.trim()) {
        Swal.fire("Error", "Description is required", "error");
        return;
    }
    if (!item.categoryID || item.categoryID <= 0) {
        Swal.fire("Error", "Valid Category ID is required", "error");
        return;
    }
    if (!item.price || item.price <= 0) {
        Swal.fire("Error", "Valid Price is required", "error");
        return;
    }
    if (!imageFile && !imagePreview) {
        Swal.fire("Error", "Image is required", "error");
        return;
    }

    try {
        const isEdit = params.id !== "0";
        const formData = new FormData();

        // Common form data
        formData.append('CategoryID', item.categoryID.toString());
        formData.append('Name', item.name);
        formData.append('Description', item.description);
        formData.append('Price', item.price.toString());

        if (isEdit) {
            formData.append('MenuID', params.id);
        }
        if (imageFile) {
            formData.append('Image', imageFile);
        }

        const url = isEdit 
            ? `http://localhost:5226/api/Menu/Update/${params.id}`
            : "http://localhost:5226/api/Menu/Create";

        const response = await fetch(url, {
            method: isEdit ? "PUT" : "POST",
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }

        await Swal.fire({
            title: "Success",
            text: isEdit ? "Item updated successfully!" : "Item created successfully!",
            icon: "success",
            confirmButtonText: "OK"
        });

        nav("/admin");
    } catch (error) {
        console.error("Submit Error:", error);
        try {
            const errorObj = JSON.parse(error.message);
            let errorMessage = "";
            if (errorObj.errors) {
                Object.keys(errorObj.errors).forEach(key => {
                    errorMessage += `${key}: ${errorObj.errors[key].join(", ")}\n`;
                });
            }
            Swal.fire("Validation Errors", errorMessage, "error");
        } catch {
            Swal.fire("Error", error.message || "An error occurred while saving the item", "error");
        }
    }
};


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                alert("File size must be less than 5MB");
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert("File must be an image");
                return;
            }

            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview("");
    };

    const change = (e) => {
        setItem({ ...item, [e.target.name]: e.target.value });
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>
                {params.id !== "0" ? "Edit Menu Item" : "Create New Menu Item"}
            </h2>
            
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div style={styles.grid}>
                <div>
                    <label htmlFor="categoryID">Category <span>*</span></label>
                    <select
                        id="categoryID"
                        name="categoryID"
                        value={item.categoryID}
                        onChange={(e) => setItem({ ...item, categoryID: e.target.value })}
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option 
                                key={category.categoryID} 
                                value={category.categoryID}
                            >
                                {category.categoryName}
                            </option>
                        ))}
                    </select>
                </div>
                    
                    <div>
                        <label style={styles.label} htmlFor="price">
                            Price ($) <span style={{ color: "#e53e3e" }}>*</span>
                        </label>
                        <input
                            style={styles.input}
                            type="number"
                            id="price"
                            name="price"
                            value={item.price}
                            onChange={change}
                            required
                            min="0.01"
                            step="0.01"
                        />
                    </div>
                </div>

                <label style={styles.label} htmlFor="name">
                    Item Name <span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <input
                    style={styles.input}
                    type="text"
                    id="name"
                    name="name"
                    value={item.name}
                    onChange={change}
                    placeholder="Enter item name"
                    required
                />

                <label style={styles.label}>
                    Image <span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <div style={{ marginBottom: "1rem" }}>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        style={{ display: "block", marginBottom: "0.5rem" }}
                    />
                    {imagePreview && (
                        <>
                            <img 
                                src={imagePreview} 
                                alt="Preview" 
                                style={styles.imagePreview}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                                }}
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                style={{ 
                                    backgroundColor: "#e53e3e",
                                    color: "white",
                                    padding: "0.5rem 1rem",
                                    borderRadius: "4px",
                                    border: "none",
                                    cursor: "pointer"
                                }}
                            >
                                Remove Image
                            </button>
                        </>
                    )}
                </div>

                <label style={styles.label} htmlFor="description">
                    Description <span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <textarea
                    style={{...styles.input, minHeight: "100px"}}
                    id="description"
                    name="description"
                    value={item.description}
                    onChange={change}
                    placeholder="Enter item description"
                    required
                />

                <button
                    type="submit"
                    style={{
                        ...styles.button,
                        backgroundColor: "#48bb78",
                        color: "white",
                        marginTop: "1.5rem"
                    }}
                >
                    {params.id !== "0" ? "Update Menu Item" : "Create Menu Item"}
                </button>
            </form>
        </div>
    );
}