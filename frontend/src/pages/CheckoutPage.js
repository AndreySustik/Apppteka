import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CheckoutPage.css';

function CheckoutPage({ cart, clearCart }) {
  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');
  const [user, setUser] = useState(null); // Добавляем состояние для пользователя
  const navigate = useNavigate();

  // Загружаем данные пользователя при монтировании компонента
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:8080/api.php?action=profile', {
          credentials: 'include', // Важно для передачи кук
        });
        const data = await response.json();
        if (data.id) {
          setUser(data); // Устанавливаем данные пользователя
        } else {
          console.error('Пользователь не авторизован');
        }
      } catch (error) {
        console.error('Ошибка при загрузке профиля:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleOrderSubmit = async () => {
    if (!cart || cart.length === 0) {
      alert("⚠️ Корзина пуста!");
      return;
    }

    // Проверяем, что пользователь авторизован
    if (!user) {
      alert("❌ Пользователь не авторизован!");
      return;
    }

    // Формируем данные для заказа
    const orderData = {
      address,
      comment,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      items: cart.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      const response = await fetch("http://localhost:8080/api.php?action=create_order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include', // Важно для передачи кук
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if (data.success) {
        clearCart();
        navigate(`/order-confirmation/${data.order_id}`);
      } else {
        alert("❌ Ошибка оформления заказа: " + data.message);
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert("❌ Ошибка при отправке запроса на сервер");
    }
  };

  return (
    <div className="checkout-page">
      <h1>📦 Оформление заказа</h1>
      <label>🏠 Адрес доставки:</label>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Введите ваш адрес"
      />

      <label>📝 Комментарий:</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Дополнительные пожелания к заказу"
      ></textarea>

      <button className="submit-order-btn" onClick={handleOrderSubmit}>
        ✅ Подтвердить заказ
      </button>
    </div>
  );
}

export default CheckoutPage;