import React from 'react';
import { useNavigate } from 'react-router-dom'; // Добавляем useNavigate
import ProductCard from './ProductCard';
import '../styles/FavoritesPage.css';

function FavoritesPage({ favorites, toggleFavorite, addToCart, removeFromCart, cart }) {
  const navigate = useNavigate(); // Хук для навигации

  return (
    <div className="favorites-page">
      <h1>Избранное</h1>

      {/* Кнопка "Домой" */}
      <button className="home-btn" onClick={() => navigate('/user')}>
        Домой
      </button>

      <div className="favorites-list">
        {favorites.length > 0 ? (
          favorites.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              toggleFavorite={toggleFavorite}
              isFavorite={true} // Все товары на странице избранного уже в избранном
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              cart={cart}
            />
          ))
        ) : (
          <p className="empty-favorites">В избранном пока ничего нет.</p>
        )}
      </div>
    </div>
  );
}

export default FavoritesPage;