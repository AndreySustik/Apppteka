import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "./ConfirmationModal";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();

  // Загрузка данных в зависимости от активной вкладки
  useEffect(() => {
    setLoading(true);
    setError(null);

    if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "products") {
      fetchProducts();
    } else if (activeTab === "reviews") {
      fetchReviews();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/api.php?action=get_users");
      if (!response.ok) throw new Error("Ошибка загрузки пользователей");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8080/api.php?action=products");
      if (!response.ok) throw new Error("Ошибка загрузки товаров");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch("http://localhost:8080/api.php?action=get_reviewsss");
      if (!response.ok) throw new Error("Ошибка загрузки отзывов");
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Удаление пользователя
  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/api.php?action=delete_user&id=${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Ошибка удаления пользователя");
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  // Изменение роли пользователя
  const handleChangeRole = async (userId, newRole) => {
    try {
      const response = await fetch(`http://localhost:8080/api.php?action=change_role&id=${userId}&role=${newRole}`, {
        method: "PUT",
      });
      if (!response.ok) throw new Error("Ошибка изменения роли");
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  // Открытие модального окна для удаления
  const confirmDelete = (userId) => {
    setSelectedUserId(userId);
    setModalMessage("Вы уверены, что хотите удалить этого пользователя?");
    setIsModalOpen(true);
  };

  // Открытие модального окна для изменения роли
  const confirmChangeRole = (userId, newRole) => {
    setSelectedUserId(userId);
    setSelectedRole(newRole);
    setModalMessage(`Вы уверены, что хотите изменить роль пользователя на "${newRole}"?`);
    setIsModalOpen(true);
  };

  // Подтверждение действия в модальном окне
  const handleConfirm = () => {
    if (modalMessage.includes("удалить")) {
      handleDeleteUser(selectedUserId);
    } else if (modalMessage.includes("изменить")) {
      handleChangeRole(selectedUserId, selectedRole);
    }
    setIsModalOpen(false);
  };

  // Закрытие модального окна
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Выход из системы
  const handleLogout = () => {
    fetch("http://localhost:8080/api.php?action=logout", { credentials: "include" })
      .then(() => {
        navigate("/login");
      });
  };

  return (
    <div className="admin-dashboard">
      {/* Модальное окно */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        message={modalMessage}
      />

      <div className="admin-header">
        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          Пользователи
        </button>
        <button
          className={activeTab === "products" ? "active" : ""}
          onClick={() => setActiveTab("products")}
        >
          Товары
        </button>
        <button
          className={activeTab === "reviews" ? "active" : ""}
          onClick={() => setActiveTab("reviews")}
        >
          Отзывы
        </button>
        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => setActiveTab("orders")}
        >
          Заказы
        </button>
        <button
          className={activeTab === "stats" ? "active" : ""}
          onClick={() => setActiveTab("stats")}
        >
          Статистика
        </button>
        <button className="logout" onClick={handleLogout}>
          Выйти
        </button>
      </div>

      {activeTab === "users" && (
        <div className="admin-content">
          <h3>Пользователи</h3>
          {loading && <p>Загрузка пользователей...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Имя пользователя</th>
                  <th>Email</th>
                  <th>Роль</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(e) => confirmChangeRole(user.id, e.target.value)}
                      >
                        <option value="user">Пользователь</option>
                        <option value="admin">Администратор</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={() => confirmDelete(user.id)}>Удалить</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === "products" && (
        <div className="admin-content">
          <h3>Товары</h3>
          {loading && <p>Загрузка товаров...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Название</th>
                  <th>Цена</th>
                  <th>Категория</th>
                  <th>Изображение</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.category}</td>
                    <td>
                      <img src={product.image} alt={product.name} style={{ width: "50px" }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="admin-content">
          <h3>Отзывы</h3>
          {loading && <p>Загрузка отзывов...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>ID Товара</th>
                  <th>Имя Пользователя</th>
                  <th>Комментарий</th>
                  <th>Рейтинг</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id}>
                    <td>{review.id}</td>
                    <td>{review.product_id}</td>
                    <td>{review.username}</td>
                    <td>{review.comment}</td>
                    <td>{review.rating || "Нет оценки"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === "orders" && (
        <div className="admin-content">
          <h3>Заказы</h3>
          {/* Здесь можно добавить таблицу с заказами */}
        </div>
      )}

      {activeTab === "stats" && (
        <div className="admin-content">
          <h3>Статистика</h3>
          {/* Здесь можно добавить статистику */}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;