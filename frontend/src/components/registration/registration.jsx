import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import s from './registration.module.scss'

const Registration = () => {

    //Получаем пользователя из localStorage
    const userData = localStorage.getItem('user')

    // навигация после входа
    const navigate = useNavigate()

    //логика от нейронки

    const [formData, setFormData] = useState({
        username: '',
        age: '',
        pasport: '',
        v_u: '',
        email: '',
        password: '',
        check_password: '',
        phone: '',
        pay: ''
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitRegistration = async (e) => {
        e.preventDefault();
        
        try {
            
            const response = await fetch('http://localhost:3001/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        username: formData.username,
                        email: formData.email,
                        password: formData.password,
                        age: formData.age,
                        pasport: formData.pasport,
                        v_u: formData.v_u,
                        phone: formData.phone,
                        pay: formData.pay
                    }
                )
            });


            const data = await response.json();
            if (!response.ok) {
                // Если есть ошибки валидации
                if (data.errors) {
                    const validationErrors = {};
                    data.errors.forEach(err => {
                        validationErrors[err.param] = err.msg;
                    });
                    setErrors(validationErrors);
                } else if (data.error) {
                    setErrors({ general: data.error });
                }
                return;
            }

            // Успешная регистрация
            setMessage(data.message);
            setErrors({});
            // Можно перенаправить пользователя или очистить форму
            setFormData({
                username: '',
                age: '',
                pasport: '',
                v_u: '',
                email: '',
                password: '',
                check_password: '',

            });
        } catch (error) {
            setErrors({ general: 'Ошибка соединения с сервером' });
        }
    };

    const handleSubmitLogin = async (e) => {
        e.preventDefault();
        console.log(JSON.stringify({
            email: formData.email,
            password: formData.password
        }));
    
        try {
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();
            console.log('Login response:', data);
            if (!response.ok) {
                // Обработка ошибок валидации
                if (data.errors) {
                    const validationErrors = {};
                    data.errors.forEach(err => {
                        validationErrors[err.param] = err.msg;
                    });
                    setErrors(validationErrors);
                } else if (data.error) {
                    setErrors({ general: data.error });
                }
                return;
            }

            // Успешный вход
            setMessage(data.message);
            setErrors({});

            // Сохраняем токен и данные пользователя
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Перенаправляем пользователя
            navigate('/Profile'); // Или другой защищенный маршрут

        } catch (error) {
            setErrors({ general: 'Ошибка соединения с сервером' });
        }
    };

    const handleLogOut = () =>{
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    //Сокрытие ненужной формы и кнопки
    const [active, setActive] = useState(false)
    const handleActive = () => {
        setActive(!active)
    }


    return (
        <>
        {!localStorage.getItem('token') ? (
            <div className={s.container}>
                {message && <div className="success">{message}</div>}
                {errors.general && <div className="error">{errors.general}</div>}
                <div className={s.controls}>
                    <button
                        className={active ? s.controls__registration : s.controls__registration + '' + s.unactive }
                        onClick={handleActive}
                        disabled={!active} >
                        Регистрация
                    </button>

                    <button
                        className={active ? s.controls__login : s.controls__login + '' + s.unactive}
                        onClick={handleActive}
                        disabled={active}>
                        Вход
                    </button>
                </div>
                {!active ? (
                    <form  className={s.registration} onSubmit={handleSubmitRegistration}>
                        <div className={s.form__wrapper}>
                            <label htmlFor="username">ФИО</label>
                            <input
                                type="text"
                                name='username'
                                placeholder='Введите ваше ФИО'
                                value={formData.username}
                                onChange={handleChange} />
                        </div>
                        <div className={s.form__wrapper}>
                            <label htmlFor="age">Возраст</label>
                            <input
                                type="text"
                                name='age'
                                placeholder='Введите ваш возраст'
                                value={formData.age}
                                onChange={handleChange} />
                        </div>
                        <div className={s.form__wrapper}>
                            <label htmlFor="pasport">Паспорт</label>
                            <input
                                type="text"
                                name='pasport'
                                placeholder='Введите ваш паспорт'
                                value={formData.pasport}
                                onChange={handleChange} />
                        </div>
                        <div className={s.form__wrapper}>
                            <label htmlFor="v_u">Номер водительского удостоверения</label>
                            <input
                                type="text"
                                name='v_u'
                                placeholder='Введите ваше ВУ'
                                value={formData.v_u}
                                onChange={handleChange} />
                        </div>
                        <div className={s.form__wrapper}>
                            <label htmlFor="email">Почта</label>
                            <input
                                name='email'
                                type="email"
                                placeholder='Введите вашу почту'
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <div className="error">{errors.email}</div>}  
                        </div>
                        <div className={s.form__wrapper}>
                            <label htmlFor="password">Пароль</label>
                            <input
                                name='password'
                                type="password"
                                placeholder='Введите ваш пароль'
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {errors.password && <div className="error">{errors.password}</div>}  
                        </div>
                        <div className={s.form__wrapper}>
                            <label htmlFor="check_password">Подтверждение пароля</label>
                            <input
                                name='check_password'
                                type="password"
                                placeholder='Введите ваш пароль'
                                value={formData.check_password}
                                onChange={handleChange}
                            />
                        </div>
                        <button className={s.form__submit} type='submit'>Зарегистрироваться</button>
                    </form>
                ) : (
                    <form  className={s.login} onSubmit={handleSubmitLogin}>
                        <div className={s.form__wrapper}>
                            <label htmlFor="email">Почта</label>
                            <input
                                type="email"
                                name='email'
                                placeholder='Введите вашу почту'
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <div className="error">{errors.email}</div>}                            
                        </div>
                        <div className={s.form__wrapper}>
                            <label htmlFor="password">Пароль</label>
                            <input
                                type="password"
                                name='password'
                                placeholder='Введите ваш пароль'
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {errors.password && <div className="error">{errors.password}</div>}                            
                        </div>
                        <button className={s.form__submit} type='submit'>Войти</button>
                    </form>
                )}
            </div>
            ):(
                <>
                    <div>{userData.fio} желаете выйти из аккаунта?</div>
                    <button onClick={handleLogOut}>Выйти</button>
                </>
            )}
        </>
    )
}



export default Registration