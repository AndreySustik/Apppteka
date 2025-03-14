import React, { useEffect, useState, useRef } from 'react';
import ProductCard from './ProductCard';
import '../styles/PopularProducts.css';
import LeftArrow from '../assets/icons/left-arrow.svg'; // Импорт SVG
import RightArrow from '../assets/icons/right-arrow.svg'; // Импорт SVG

function PopularProducts({ favorites, toggleFavorite, isFavorite, addToCart, removeFromCart, cart }) {
  const [popularProducts, setPopularProducts] = useState([]);
  const productsContainerRef = useRef(null);

  // Загрузка популярных товаров
  useEffect(() => {
    fetch("http://localhost:8080/api.php?action=popular_products")
      .then((res) => res.json())
      .then((data) => {
        console.log("Популярные товары:", data); // Логируем данные
        setPopularProducts(data);
      })
      .catch((error) => console.error("Ошибка загрузки популярных товаров:", error));
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

  if (!popularProducts || popularProducts.length === 0) {
    return <p>Нет доступных товаров.</p>; // Сообщение, если товаров нет
  }

  return (
    <div className="popular-products">
      <h2>Популярные товары</h2>
      <div className="products-container">
        <button className="scroll-button left" onClick={scrollLeft}>
          <img src={LeftArrow} alt="Прокрутить влево" />
        </button>
        <div className="products-grid" ref={productsContainerRef}>
          {popularProducts.map((product) => (
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

export default PopularProducts;