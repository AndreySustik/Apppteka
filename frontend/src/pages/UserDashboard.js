import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserDashboard.css";
import PopularProducts from './PopularProducts';
import BestSellers from './BestSellers'; // Импорт нового компонента
import ContactInfo from './ContactInfo';
import AppptekaInfo from './AppptekaInfo';

// Импорт локальных иконок
import searchIcon from "../assets/icons/search.svg";
import heartIcon from "../assets/icons/favorites.svg";
import cartIcon from "../assets/icons/cart.svg";
import profileIcon from "../assets/icons/profile.svg";

function UserDashboard({ favorites, cart, toggleFavorite, addToCart, removeFromCart }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api.php?action=profile", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.id) {
          navigate("/login");
        } else {
          setUser(data);
        }
      })
      .catch((error) => {
        console.error("Ошибка загрузки профиля:", error);
        navigate("/login");
      });
  }, [navigate]);

  const handleLogout = () => {
    fetch("http://localhost:8080/api.php?action=logout", {
      credentials: "include",
    })
      .then(() => {
        navigate("/login");
      })
      .catch((error) => console.error("Ошибка при выходе:", error));
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);

    if (query.length > 1) {
      fetch(`http://localhost:8080/api.php?action=search_suggestions&query=${query}`)
        .then((res) => res.json())
        .then((data) => setSuggestions(data))
        .catch((error) => console.error("Ошибка загрузки подсказок:", error));
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectProduct = (product) => {
    navigate(`/product/${product.id}`);
    setSearch("");
    setSuggestions([]);
  };

  return (
    <div className="dashboard-container">
      {/* Верхняя панель */}
      <div className="navbar">
        <button className="catalog-btn" onClick={() => navigate("/catalog")}>
          Каталог
        </button>
        <div className="search-box">
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={search}
            onChange={handleSearchChange}
          />
          <img src={searchIcon} alt="Поиск" className="icon" />
          <div className="suggestions-container">
            {suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((product) => (
                  <li key={product.id} onClick={() => handleSelectProduct(product)}>
                    {product.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="icons">
          <img
            src={heartIcon}
            alt="Избранное"
            className="icon"
            title="Избранное"
            onClick={() => navigate("/favorites")}
          />
          <img
            src={cartIcon}
            alt="Корзина"
            className="icon"
            title="Корзина"
            onClick={() => navigate("/cart")}
          />
          {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
          <img
            src={profileIcon}
            alt="Профиль"
            className="icon"
            title="Профиль"
            onClick={() => navigate("/profile")}
          />
        </div>
      </div>

      {/* Блок с популярными товарами */}
      <PopularProducts
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        isFavorite={(productId) => favorites.some((fav) => fav.id === productId)}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        cart={cart}
      />

      {/* Блок с хитами продаж */}
      <BestSellers
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        isFavorite={(productId) => favorites.some((fav) => fav.id === productId)}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        cart={cart}
      />

      {/* Блок информации о Apppteka */}
      <AppptekaInfo />

      {/* Блок контактной информации */}
      <ContactInfo />
    </div>
  );
}

export default UserDashboard;