import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Добавляем useNavigate
import '../styles/ProfilePage.css';

function ProfilePage({ user, setUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  const [orders, setOrders] = useState([]); // Состояние для хранения заказов
  const navigate = useNavigate(); // Хук для навигации

  // Загрузка заказов пользователя
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:8080/api.php?action=getUserOrders', {
          credentials: 'include',
        });
        const data = await response.json();
        if (data.success) {
          setOrders(data.orders);
        } else {
          console.error('Ошибка при загрузке заказов:', data.message);
        }
      } catch (error) {
        console.error('Ошибка:', error);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Обработчик изменения полей формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Отправляемые данные:", formData);

    try {
      const response = await fetch('http://localhost:8080/api.php?action=updateProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Ответ от сервера:", data);

      if (data.success) {
        setIsEditing(false);
        setUser((prevUser) => ({
          ...prevUser,
          username: formData.username,
          email: formData.email,
        }));
        console.log("Профиль успешно обновлен");
      } else {
        console.error('Ошибка при обновлении профиля:', data.message);
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  // Обработчик выхода из системы
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/api.php?action=logout', {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.message === "Выход выполнен") {
        setUser(null); // Сбрасываем состояние пользователя
        navigate('/login'); // Перенаправляем на страницу входа
      } else {
        console.error('Ошибка при выходе:', data.message);
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  return (
    <div className="profile-page">
      <h1>Профиль</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Имя пользователя:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="save-button">Сохранить</button>
          <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>
            Отмена
          </button>
        </form>
      ) : (
        <div className="profile-info">
          <p><strong>Имя пользователя:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Роль:</strong> {user?.role}</p>
          <button onClick={() => setIsEditing(true)} className="edit-button">
            Редактировать
          </button>
          <button onClick={handleLogout} className="logout-button">
            Выйти
          </button>
        </div>
      )}

      {/* Секция с заказами */}
      <div className="orders-section">
        <h2>Мои заказы</h2>
        {orders.length > 0 ? (
          <ul className="orders-list">
            {orders.map((order) => (
              <li key={order.id} className="order-item">
                <p><strong>Заказ №:</strong> {order.id}</p>
                <p><strong>Адрес доставки:</strong> {order.address}</p>
                <p><strong>Комментарий:</strong> {order.comment || 'Нет комментария'}</p>
                <p><strong>Товары:</strong> {order.products}</p>
                <p><strong>Сумма:</strong> {order.total} руб.</p>
                <p><strong>Дата заказа:</strong> {new Date(order.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>У вас пока нет заказов.</p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;