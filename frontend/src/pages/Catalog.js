import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Добавляем useNavigate
import "../styles/Catalog.css";
import ProductCard from "./ProductCard";

function Catalog({ favorites, toggleFavorite, addToCart, removeFromCart, cart }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate(); // Хук для навигации

  useEffect(() => {
    fetch("http://localhost:8080/api.php?action=products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      });
  }, []);

  const handleFilter = () => {
    let filtered = products.filter(
      (product) =>
        (!category || product.category === category) &&
        product.price >= priceRange[0] &&
        product.price <= priceRange[1]
    );

    if (sort === "price_asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "price_desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === "alphabet") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(filtered);
    setIsFilterOpen(false);
  };

  return (
    <div className="catalog-container">
      <h1>Каталог товаров</h1>

      {/* Кнопка "Домой" */}
      <button className="home-btn" onClick={() => navigate('/user')}>
        Домой
      </button>

      {/* Кнопка открытия фильтров */}
      <button className="filter-btn" onClick={() => setIsFilterOpen(true)}>
        Фильтры
      </button>

      {/* Окно фильтров */}
      {isFilterOpen && (
        <div className="filter-modal">
          <div className="filter-content">
            <button className="close-btn" onClick={() => setIsFilterOpen(false)}>✖</button>
            <h2>Фильтры</h2>

            <div className="filter-group">
              <label>Категория:</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Все категории</option>
                <option value="Гигиена">Гигиена</option>
                <option value="Животные">Животные</option>
                <option value="Красота">Красота</option>
                <option value="Медтовары">Медтовары</option>
                <option value="Линзы">Линзы</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Сортировка:</label>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="">Без сортировки</option>
                <option value="price_asc">По цене (возрастание)</option>
                <option value="price_desc">По цене (убывание)</option>
                <option value="alphabet">По алфавиту</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Цена: {priceRange[0]} - {priceRange[1]} руб.</label>
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
              />
            </div>

            <button className="apply-btn" onClick={handleFilter}>Применить</button>
          </div>
        </div>
      )}

      {/* Отображение товаров */}
      <div className="product-list">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            toggleFavorite={toggleFavorite}
            isFavorite={favorites.some((fav) => fav.id === product.id)}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            cart={cart}
          />
        ))}
      </div>
    </div>
  );
}

export default Catalog;