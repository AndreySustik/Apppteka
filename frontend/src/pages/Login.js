import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css'; // Подключаем стили

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Введите email и пароль!');
      return;
    }

    const res = await fetch('http://localhost:8080/api.php?action=login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });
    const data = await res.json();

    if (data.user) {
      setUser(data.user);
      navigate(data.user.role === 'admin' ? '/admin' : '/user');
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Вход</h2>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Пароль" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Войти</button>
        <p>Нет аккаунта? <a href="/register">Регистрация</a></p>
      </div>
    </div>
  );
}

export default Login;
