import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Swal from "sweetalert2";
import "./Admin.css"; // External styles

export default function AdminPage() {
  const [fooditem, setFoodItem] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch("http://localhost:5226/api/Menu/GetAll");
      if (!response.ok) throw new Error("Failed to fetch menu");
      const data = await response.json();
      console.log("API Response:", data); // Debugging
      setFoodItem(data);
    } catch (error) {
      setError("Error fetching menu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) return;

      const response = await fetch(`http://localhost:5226/api/Menu/Delete/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Delete failed");
      }

      await Swal.fire("Deleted!", "Item has been deleted.", "success");
      loadData();
    } catch (error) {
      console.error("Delete Error:", error);
      Swal.fire("Error", error.message, "error");
    }
  };

  if (loading) {
    return <div className="text-center my-5"><h4>Loading...</h4></div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <>
      <div className="container mt-4">
        <h2 className="text-center mb-4">All Menu Items ({fooditem.length})</h2>

        {fooditem.length > 0 ? (
          <div className="row">
            {fooditem.map((item) => (
              <div key={item.menuID} className="col-12 col-md-6 col-lg-4 mb-4">
                <div className="card menu-item">
                  <img src={item.imageURL} alt={item.name} className="menu-img"/>
                  <span className="badge category-badge">{item.categoryName}</span>
                  <span className="badge price-badge">₹{item.price}</span>
                  
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text">{item.description}</p>
                    <div className="button-group">
                    <Link to={`/admin/form/${item.menuID}`} className="btn btn-outline-primary btn-sm w-100">
                            <i className="fas fa-edit"></i> Edit
</Link>
<button onClick={() => handleDelete(item.menuID)} className="btn btn-outline-danger btn-sm w-100">
  <i className="fas fa-trash"></i> Delete
</button>

                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center alert alert-warning">No menu items found</div>
        )}
      </div>

      {/* Floating Add Button */}
      <Link to={"/admin/form/0"} className="add-btn">
        <i className="fas fa-plus"></i>
      </Link>

      <Footer />
    </>
  );
}
