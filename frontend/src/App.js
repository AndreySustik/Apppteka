import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Catalog from './pages/Catalog';
import FavoritesPage from './pages/FavoritesPage';
import CartPage from './pages/CartPage';
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import ProductPage from "./pages/ProductPage";
import ProfilePage from './pages/ProfilePage';

function App() {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]); // Состояние для избранных товаров
  const [cart, setCart] = useState([]); // Состояние для корзины

  // Функция для добавления/удаления товара из избранного
  const toggleFavorite = (product) => {
    setFavorites((prevFavorites) => {
      const isAlreadyFavorite = prevFavorites.some((fav) => fav.id === product.id);
      if (isAlreadyFavorite) {
        return prevFavorites.filter((fav) => fav.id !== product.id); // Удаляем товар
      } else {
        return [...prevFavorites, product]; // Добавляем товар
      }
    });
  };

  // Функция для добавления товара в корзину
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        // Если товар уже в корзине, увеличиваем количество
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Если товара нет в корзине, добавляем его с количеством 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Функция для удаления товара из корзины
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]); // Очищаем корзину
  };

  // Функция для изменения количества товара в корзине
  const updateCartItemQuantity = (productId, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  useEffect(() => {
    fetch('http://localhost:8080/api.php?action=profile', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.id) setUser(data);
      });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={!user ? <Navigate to="/login" /> : (user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/user" />)} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user" element={user?.role === 'user' ? <UserDashboard favorites={favorites} cart={cart} toggleFavorite={toggleFavorite} addToCart={addToCart} removeFromCart={removeFromCart}/> : <Navigate to="/login" />} />
        <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/catalog" element={<Catalog favorites={favorites} toggleFavorite={toggleFavorite} addToCart={addToCart} removeFromCart={removeFromCart} cart={cart} />} />
        <Route path="/favorites" element={<FavoritesPage favorites={favorites} toggleFavorite={toggleFavorite} addToCart={addToCart} removeFromCart={removeFromCart} cart={cart} />} />
        <Route path="/cart" element={<CartPage cart={cart} removeFromCart={removeFromCart} updateCartItemQuantity={updateCartItemQuantity} />} />
        <Route path="/checkout" element={<CheckoutPage cart={cart} clearCart={clearCart} />} />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        <Route path="/product/:id" element={<ProductPage favorites={favorites} cart={cart} toggleFavorite={toggleFavorite} addToCart={addToCart} removeFromCart={removeFromCart}/>} />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} />} />
      </Routes>
    </Router>
  );
}

export default App;