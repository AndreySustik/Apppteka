import React from 'react';
import '../styles/ContactInfo.css';

function ContactInfo() {
  return (
    <div className="contact-info">
      <h2>Контактная информация</h2>
      <div className="contact-sections">
        <div className="contact-section">
          <h3>Помощь</h3>
          <ul>
            <li>Доставка</li>
            <li>Самовывоз из аптек</li>
            <li>Обмен и возврат</li>
            <li>Что с моим заказом?</li>
            <li>FAQ</li>
            <li>Рецепты</li>
            <li>Блог</li>
          </ul>
        </div>

        <div className="contact-section">
          <h3>Appteka</h3>
          <ul>
            <li>О компании</li>
            <li>Карьера</li>
            <li>Поставщики</li>
            <li>Лицензия</li>
            <li>Реклама на сайте</li>
            <li>Сотрудничество для аптек</li>
            <li>Подарочный купон</li>
          </ul>
        </div>

        <div className="contact-section">
          <h3>Покупателям</h3>
          <ul>
            <li>Оплата</li>
            <li>Отзывы</li>
            <li>Покупайте как юрлицо</li>
            <li>Программа лояльности</li>
          </ul>
        </div>

        <div className="contact-section">
          <h3>Правовая информация</h3>
          <ul>
            <li>Политика конфиденциальности</li>
            <li>Пользовательское соглашение</li>
            <li>Политика рекомендаций</li>
            <li>Этика и соответствие</li>
            <li>Обратная связь</li>
          </ul>
        </div>
      </div>

      <div className="contact-details">
        <p>Email: <a href="#">Appteka@teka.ru</a></p>
        <p>Если есть вопросы, отзывы и предложения</p>
        <p>Телефон: <a href="#">8 787 787 77 77</a></p>
        <p>Круглосуточно</p>
      </div>
    </div>
  );
}

export default ContactInfo;