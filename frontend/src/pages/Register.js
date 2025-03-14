import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css'; // Подключаем стили

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      alert('Пожалуйста, заполните все поля!');
      return;
    }

    const res = await fetch('http://localhost:8080/api.php?action=register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    alert(data.message);
    if (data.message === 'Регистрация успешна') {
      navigate('/login');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Регистрация</h2>
        <input type="text" placeholder="Имя пользователя" onChange={(e) => setUsername(e.target.value)} />
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Пароль" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleRegister}>Зарегистрироваться</button>
        <p>Уже есть аккаунт? <a href="/login">Войти</a></p>
      </div>
    </div>
  );
}

export default Register;
