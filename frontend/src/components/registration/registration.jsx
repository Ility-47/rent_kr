import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import s from './registration.module.scss'

const Registration = () => {
    const userData = localStorage.getItem('user')
    const navigate = useNavigate()

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

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passportRegex = /^[0-9]{4}\s?[0-9]{6}$/;
        const vuRegex = /^[0-9]{2}\s?[0-9]{2}\s?[0-9]{6}$/;
        const phoneRegex = /^\+?[0-9]{10,15}$/;

        // Проверка ФИО
        if (!formData.username.trim()) {
            newErrors.username = 'ФИО обязательно';
        } else if (formData.username.length < 3) {
            newErrors.username = 'ФИО слишком короткое';
        }

        // Проверка возраста
        if (!formData.age) {
            newErrors.age = 'Возраст обязателен';
        } else if (isNaN(formData.age) || formData.age < 18 || formData.age > 100) {
            newErrors.age = 'Возраст должен быть от 18 до 100 лет';
        }

        // Проверка паспорта
        if (!formData.pasport) {
            newErrors.pasport = 'Паспорт обязателен';
        } else if (!passportRegex.test(formData.pasport)) {
            newErrors.pasport = 'Неверный формат паспорта (пример: 1234 567890)';
        }

        // Проверка водительского удостоверения
        if (!formData.v_u) {
            newErrors.v_u = 'Водительское удостоверение обязательно';
        } else if (!vuRegex.test(formData.v_u)) {
            newErrors.v_u = 'Неверный формат (пример: 12 34 567890)';
        }

        // Проверка email
        if (!formData.email) {
            newErrors.email = 'Email обязателен';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Неверный формат email';
        }

        // Проверка пароля
        if (!formData.password) {
            newErrors.password = 'Пароль обязателен';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Пароль должен быть не менее 6 символов';
        }

        // Проверка подтверждения пароля
        if (!formData.check_password) {
            newErrors.check_password = 'Подтвердите пароль';
        } else if (formData.password !== formData.check_password) {
            newErrors.check_password = 'Пароли не совпадают';
        }

        // Проверка телефона (если используется)
        if (formData.phone && !phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Неверный формат телефона';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Очищаем ошибку при изменении поля
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = {...prev};
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmitRegistration = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        try {
            console.log(formData)
            
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
                    }
                )
            });

            const data = await response.json();
            if (!response.ok) {
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

            setMessage(data.message);
            setErrors({});
            
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

            if (!response.ok) {
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

            setMessage(data.message);
            setErrors({});

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            navigate('/Profile');

        } catch (error) {
            setErrors({ general: 'Ошибка соединения с сервером' });
        }
    };

    const handleLogOut = () =>{
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

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
                        className={!active ? s.controls__registration : s.controls__registration + '' + s.unactive }
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
                            {errors.username && <div className={s.error}>{errors.username}</div>}
                        </div>
                        <div className={s.form__wrapper}>
                            <label htmlFor="age">Возраст</label>
                            <input
                                type="text"
                                name='age'
                                placeholder='Введите ваш возраст'
                                value={formData.age}
                                onChange={handleChange} />
                            {errors.age && <div className={s.error}>{errors.age}</div>}
                        </div>
                        <div className={s.form__wrapper}>
                            <label htmlFor="pasport">Паспорт</label>
                            <input
                                type="text"
                                name='pasport'
                                placeholder='Введите серию и номер паспорта (1234 567890)'
                                value={formData.pasport}
                                onChange={handleChange} />
                            {errors.pasport && <div className={s.error}>{errors.pasport}</div>}
                        </div>
                         <div className={s.form__wrapper}>
                            <label htmlFor="password">Пароль</label>
                            <input
                                name='password'
                                type="password"
                                placeholder='Введите ваш пароль (минимум 6 символов)'
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {errors.password && <div className={s.error}>{errors.password}</div>}  
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
                            {errors.email && <div className={s.error}>{errors.email}</div>}  
                        </div>
                        <div className={s.form__wrapper}>
                            <label htmlFor="check_password">Подтверждение пароля</label>
                            <input
                                name='check_password'
                                type="password"
                                placeholder='Повторите ваш пароль'
                                value={formData.check_password}
                                onChange={handleChange}
                            />
                            {errors.check_password && <div className={s.error}>{errors.check_password}</div>}
                        </div>
                        <div className={s.form__wrapper}>
                            <label htmlFor="v_u">Номер водительского удостоверения</label>
                            <input
                                type="text"
                                name='v_u'
                                placeholder='Введите номер ВУ (12 34 567890)'
                                value={formData.v_u}
                                onChange={handleChange} />
                            {errors.v_u && <div className={s.error}>{errors.v_u}</div>}
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
                            {errors.email && <div className={s.error}>{errors.email}</div>}                            
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
                            {errors.password && <div className={s.error}>{errors.password}</div>}                            
                        </div>
                        <button className={s.form__submit} type='submit'>Войти</button>
                    </form>
                )}
            </div>
            ):(
                <section className={s.logout}>
                    <div>Желаете выйти из аккаунта?</div>
                    <button onClick={handleLogOut}>Выйти</button>
                </section>
            )}
        </>
    )
}

export default Registration