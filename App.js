import "./App.css";
import Home from "./screens/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./screens/Login";
import "../node_modules/bootstrap-dark-5/dist/css/bootstrap-dark.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import Signup from "./screens/Signup.js";
import { CartProvider } from "./components/ContextReducer.js";
import MyOrder from "./screens/MyOrder.js";
import AdminItems from "./components/AdminItems.js";
import Adminorders from "./components/Adminorders.js"; 
import Admin from "./screens/Admin.js";
import Adminform from "./screens/Adminform.js";
import AboutUS from "./screens/AboutUS.js";
import Navbar from "./components/Navbar";
import PrivateRoute from './components/PrivateRoute';
import Cart from './screens/Cart';
import CategoryPage from './screens/CategoryPage';
function App() {
  return (
    <CartProvider>
      <Router>
        <div>
          {/* <Navbar /> */}
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/createuser" element={<Signup />} />
            <Route path="/myOrder" element={
              <PrivateRoute>
                <MyOrder />
              </PrivateRoute>
            } />
            <Route exact path="/aboutus" element={<AboutUS />} />
            <Route path="/admin" element={<Admin />} >
              <Route index element={<AdminItems />} />
              <Route path="/admin/orders" element={<Adminorders />} />
              <Route path="/admin/categories" element={<CategoryPage />} />
            </Route>
            <Route path="/cart" element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            } />
            <Route exact path="/admin/form/:id" element={<Adminform />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
