import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Добавляем useNavigate
import "../styles/ProductPage.css";

function ProductPage({ favorites, toggleFavorite, addToCart, removeFromCart, cart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0); // Состояние для рейтинга
  const [showReviews, setShowReviews] = useState(false);
  const navigate = useNavigate(); // Хук для навигации

  // Загрузка данных о товаре
  useEffect(() => {
    fetch(`http://localhost:8080/api.php?action=get_product&id=${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((error) => console.error("Ошибка загрузки товара:", error));
  }, [id]);

  // Загрузка отзывов
  useEffect(() => {
    fetch(`http://localhost:8080/api.php?action=get_reviews&product_id=${id}`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error("Ошибка загрузки отзывов:", error));
  }, [id]);

  // Добавление отзыва
  const handleAddReview = () => {
    if (!newReview.trim() || rating === 0) return; // Проверяем, что рейтинг и отзыв заполнены

    fetch("http://localhost:8080/api.php?action=add_review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: id,
        comment: newReview,
        rating: rating, // Добавляем рейтинг
      }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setNewReview("");
          setRating(0); // Сбрасываем рейтинг
          // Обновляем список отзывов
          fetch(`http://localhost:8080/api.php?action=get_reviews&product_id=${id}`)
            .then((res) => res.json())
            .then((data) => setReviews(data))
            .catch((error) => console.error("Ошибка загрузки отзывов:", error));
        }
      })
      .catch((error) => console.error("Ошибка добавления отзыва:", error));
  };

  // Проверяем, добавлен ли товар в избранное
  const isFavorite = favorites.some((fav) => fav.id === product?.id);

  // Проверяем, добавлен ли товар в корзину
  const isInCart = cart.some((item) => item.id === product?.id);

  if (!product) {
    return <p>Загрузка...</p>;
  }

  return (
    <div className="product-page">
      {/* Кнопка "Домой" */}
      <button className="home-btn" onClick={() => navigate('/user')}>
        Домой
      </button>

      <img src={product.image} alt={product.name} className="product-image" />
      <h1>{product.name}</h1>
      <p className="product-description">{product.description}</p>
      <p className="product-price">{product.price} руб.</p>

      {/* Кнопки "В избранное" и "В корзину" */}
      <div className="product-actions">
        <button
          className={`favorite-btn ${isFavorite ? 'favorite-btn-active' : ''}`}
          onClick={() => toggleFavorite(product)}
        >
          {isFavorite ? 'В избранном' : 'В избранное'}
        </button>
        <button
          className={`add-to-cart-btn ${isInCart ? 'in-cart' : ''}`}
          onClick={() => isInCart ? removeFromCart(product.id) : addToCart(product)}
        >
          {isInCart ? 'В корзине' : 'В корзину'}
        </button>
      </div>

      {/* Рейтинг товара */}
      <div className="product-rating">
        <strong>Рейтинг:</strong>
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= (product.avg_rating || 0) ? "active" : ""}`}
            >
              ★
            </span>
          ))}
        </div>
        <small>({product.avg_rating ? product.avg_rating.toFixed(1) : 0} из 5)</small>
      </div>

      {/* Кнопка для отображения отзывов */}
      <button className="toggle-reviews-btn" onClick={() => setShowReviews(!showReviews)}>
        {showReviews ? "Скрыть отзывы" : "Показать отзывы"}
      </button>

      {/* Секция отзывов */}
      {showReviews && (
        <div className="reviews-section">
          <h2>Отзывы</h2>

          {/* Форма для добавления отзыва */}
          <div className="review-form">
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= rating ? "active" : ""}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Оставьте ваш отзыв..."
            />
            <button onClick={handleAddReview}>Отправить отзыв</button>
          </div>

          {/* Список отзывов */}
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review">
                <strong>{review.username}</strong>
                <div className="review-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${star <= review.rating ? "active" : ""}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p>{review.comment}</p>
                <small>{new Date(review.created_at).toLocaleString()}</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductPage;