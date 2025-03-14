import { Link } from "react-router-dom";
import React from 'react';
import '../styles/ProductCard.css';

function ProductCard({ product, toggleFavorite, isFavorite, addToCart, removeFromCart, cart }) {
  const handleFavoriteClick = () => {
    if (toggleFavorite) {
      toggleFavorite(product); // Вызываем функцию из пропсов
    }
  };

  const handleAddToCartClick = () => {
    if (addToCart && removeFromCart && cart) {
      const isInCart = cart.some((item) => item.id === product.id);
      if (isInCart) {
        removeFromCart(product.id); // Удаляем товар из корзины, если он уже там
      } else {
        addToCart(product); // Добавляем товар в корзину
      }
    }
  };

  const isInCart = cart && cart.some((item) => item.id === product.id); // Проверяем, есть ли товар в корзине

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        <img src={product.image} alt={product.name} className="product-image" />
        <h3 className="product-name">{product.name}</h3>
      </Link>
      <p className="product-price">{product.price} руб.</p>
      <div className="buttons-container">
        <button
          className={`favorite-btn ${isFavorite ? 'favorite-btn-active' : ''}`} // Добавляем класс для активного состояния
          onClick={handleFavoriteClick} // Обработчик клика
        >
          {isFavorite ? 'В избранном' : 'В избранное'} {/* Меняем текст кнопки */}
        </button>
        <button
          className={`add-to-cart-btn ${isInCart ? 'in-cart' : ''}`} // Добавляем класс, если товар в корзине
          onClick={handleAddToCartClick}
        >
          {isInCart ? 'В корзине' : 'В корзину'} {/* Меняем текст кнопки */}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;