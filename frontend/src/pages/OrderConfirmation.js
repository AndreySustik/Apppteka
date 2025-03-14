import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/OrderConfirmation.css';

function OrderConfirmation() {
  const { orderId } = useParams();

  return (
    <div className="order-confirmation">
      <h1>✅ Заказ оформлен!</h1>
      <p>Ваш номер заказа: <strong>{orderId}</strong></p>
      <Link to="/">🏠 Вернуться в каталог</Link>
    </div>
  );
}

export default OrderConfirmation;