import React, { useEffect, useState, useRef } from 'react';
import ProductCard from './ProductCard';
import '../styles/PopularProducts.css'; // Используем стили из PopularProducts
import LeftArrow from '../assets/icons/left-arrow.svg'; // Импорт SVG
import RightArrow from '../assets/icons/right-arrow.svg'; // Импорт SVG

function BestSellers({ favorites, toggleFavorite, isFavorite, addToCart, removeFromCart, cart }) {
  const [bestSellers, setBestSellers] = useState([]);
  const productsContainerRef = useRef(null);

  // Загрузка хитов продаж
  useEffect(() => {
    fetch("http://localhost:8080/api.php?action=best_sellers")
      .then((res) => res.json())
      .then((data) => {
        console.log("Хиты продаж:", data); // Логируем данные
        setBestSellers(data);
      })
      .catch((error) => console.error("Ошибка загрузки хитов продаж:", error));
  }, []);

  // Функция для прокрутки влево
  const scrollLeft = () => {
    if (productsContainerRef.current) {
      productsContainerRef.current.scrollBy({
        left: -300, // Прокрутка на 300px влево
        behavior: 'smooth',
      });
    }
  };

  // Функция для прокрутки вправо
  const scrollRight = () => {
    if (productsContainerRef.current) {
      productsContainerRef.current.scrollBy({
        left: 300, // Прокрутка на 300px вправо
        behavior: 'smooth',
      });
    }
  };

  if (!bestSellers || bestSellers.length === 0) {
    return <p>Нет доступных товаров.</p>; // Сообщение, если товаров нет
  }

  return (
    <div className="popular-products">
      <h2>Хиты продаж</h2>
      <div className="products-container">
        <button className="scroll-button left" onClick={scrollLeft}>
          <img src={LeftArrow} alt="Прокрутить влево" />
        </button>
        <div className="products-grid" ref={productsContainerRef}>
          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              toggleFavorite={toggleFavorite}
              isFavorite={isFavorite(product.id)}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              cart={cart}
            />
          ))}
        </div>
        <button className="scroll-button right" onClick={scrollRight}>
          <img src={RightArrow} alt="Прокрутить вправо" />
        </button>
      </div>
    </div>
  );
}

export default BestSellers;