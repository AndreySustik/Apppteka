import React from 'react';
import { useNavigate } from 'react-router-dom'; // Добавляем useNavigate
import '../styles/CartPage.css';

function CartPage({ cart, removeFromCart, updateCartItemQuantity }) {
  const navigate = useNavigate();

  // Функция для расчета общей стоимости
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="cart-page">
      <h1>Корзина</h1>

      {/* Кнопка "Домой" */}
      <button className="home-btn" onClick={() => navigate('/user')}>
        Домой
      </button>

      {cart.length > 0 ? (
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>{item.price} руб. x {item.quantity}</p>
                <div className="cart-item-actions">
                  <button className="quantity-btn" onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button className="quantity-btn" onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}>+</button>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Удалить</button>
                </div>
              </div>
            </div>
          ))}
          <div className="cart-total">
            <h3>Итого: {calculateTotal()} руб.</h3>
            <button className="checkout-btn" onClick={() => navigate('/checkout')}>
              Оформить заказ
            </button>
          </div>
        </div>
      ) : (
        <p className="empty-cart">Корзина пуста.</p>
      )}
    </div>
  );
}

export default CartPage;