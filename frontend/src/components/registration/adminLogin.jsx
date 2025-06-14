import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './adminLogin.module.scss';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Ошибка авторизации');
            }

            navigate('/admin/panel');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className={s.login_container}>
            <h2>Вход для администратора</h2>
            {error && <div className={s.error}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Пользователь PostgreSQL:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Пароль:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Войти</button>
            </form>
        </div>
    );
};

export default AdminLogin;