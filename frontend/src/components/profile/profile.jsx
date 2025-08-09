import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './profile.module.scss';
import Modal from 'react-modal';

const API_URL = import.meta.env.VITE_API_URL || 'https://rent-kr.onrender.com';

Modal.setAppElement('#root');

const ErrorMessage = ({ message, onClose }) => {
  return (
    <div className={s.errorToast}>
      <div className={s.errorContent}>
        <i className={`fa-solid fa-circle-exclamation ${s.errorIcon}`}></i>
        <span>{message}</span>
      </div>
      <button onClick={onClose} className={s.errorClose}>
        <i className="fa-solid fa-xmark"></i>
      </button>
    </div>
  );
};

const SettingData = ({props, customClass}) => {
    return (
        <button className={s.setting} onClick={props.handleClick}>
            <div className={s.setting__info}>
                <i className={props.icon + ' ' + customClass}></i>
                <div className={s.setting__wrapper}>
                    <h5 className={s.setting__title + ' ' + customClass}>{props.title}</h5>
                    <h6 className={s.setting__subtitle + ' ' + customClass}>{props.subtitle}</h6>
                </div>
            </div>
            <i className={"fa-solid fa-angle-right" + ' ' + customClass}></i>
        </button>
    )
}

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentSetting, setCurrentSetting] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [globalError, setGlobalError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/Registration');
                    return;
                }

                const response = await fetch(`${API_URL}/api/users/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Ошибка загрузки данных');
                }
                
                const data = await response.json();
                setUserData(data);
            } catch (error) {
                setGlobalError(error.message);
                localStorage.removeItem('token');
            }
        };
        
        fetchProfile();
    }, [navigate]);

    const openModal = (setting) => {
        setCurrentSetting(setting);
        setModalIsOpen(true);
        setError(null);
        // Устанавливаем текущее значение если оно есть
        switch(setting) {
            case 'phone':
                setInputValue(userData?.phone || '');
                break;
            case 'email':
                setInputValue(userData?.email || '');
                break;
            case 'payment':
                setInputValue(userData?.payment_method || '');
                break;
            default:
                setInputValue('');
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setInputValue('');
        setError(null);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        // Сбрасываем ошибку при изменении поля
        if (error) setError(null);
    };

    const handleSubmit = async () => {
        if ((currentSetting !== 'delete') && !inputValue.trim()) {
            setError('Поле не может быть пустым');
            return;
        }
        
        setIsLoading(true);
        setError(null);
        
        try {
            const token = localStorage.getItem('token');
            let endpoint = '';
            let body = {};
            
            switch (currentSetting) {
                case 'phone':
                    endpoint = '/api/users/update-phone';
                    body = { phone: inputValue };
                    break;
                case 'email':
                    endpoint = '/api/users/update-email';
                    body = { email: inputValue };
                    break;
                case 'payment':
                    endpoint = '/api/users/update-payment';
                    body = { paymentMethod: inputValue };
                    break;
                case 'delete':
                    endpoint = '/api/users/delete-account';
                    break;
                default:
                    return;
            }

            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: currentSetting !== 'delete' ? JSON.stringify(body) : undefined
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Произошла ошибка');
            }

            if (currentSetting === 'delete') {
                localStorage.removeItem('token');
                navigate('/Registration');
            } else {
                setUserData(prev => ({ ...prev, ...data }));
                closeModal();
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/Registration');
    };

    const closeError = () => {
        setGlobalError(null);
    };

    let profile_settings = [
        {
            icon: "fa-solid fa-phone",
            title: "Номер телефона",
            subtitle: userData?.phone || 'Добавьте номер',
            handleClick: () => openModal('phone')
        },
        {
            icon: "fa-solid fa-envelope",
            title: "Email",
            subtitle: userData?.email || 'Добавьте почту',
            handleClick: () => openModal('email')
        },   
        {
            icon: "fa-solid fa-credit-card",
            title: "Способы оплаты",
            subtitle: userData?.payment_method || 'Добавьте карту',
            handleClick: () => openModal('payment')
        },   
    ];

    if (!userData && !globalError) return <div className={s.loading}>Загрузка...</div>;

    return (
        <div className={s.profile}>
            {globalError && <ErrorMessage message={globalError} onClose={closeError} />}
            
            <h1>{userData?.fio || 'Пользователь'}</h1>
            
            <div className={s.profile__wrapper}>
                {profile_settings.map((item, key) => (
                    <SettingData props={item} key={key} />
                ))}
            </div>
            
            <div className={s.profile__wrapper}>
                <SettingData props={{
                    icon: "fa-solid fa-trash",
                    title: "Удалить аккаунт",
                    handleClick: () => openModal('delete')
                }} customClass={s.redBtn} />
                
                <SettingData props={{
                    icon: "fa-solid fa-xmark",
                    title: "Выйти из аккаунта",
                    handleClick: handleLogOut 
                }} />
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className={s.modal}
                overlayClassName={s.overlay}
                closeTimeoutMS={200}
            >
                {currentSetting !== 'delete' ? (
                    <>
                        <h2 className={s.modalTitle}>
                            {userData?.[currentSetting === 'phone' ? 'phone' : 
                             currentSetting === 'email' ? 'email' : 'payment_method'] 
                              ? 'Изменить' : 'Добавить'} 
                            {' '}
                            {{
                                phone: 'номер телефона',
                                email: 'email',
                                payment: 'способ оплаты'
                            }[currentSetting]}
                        </h2>
                        
                        <input
                            type={{
                                phone: 'tel',
                                email: 'email',
                                payment: 'text'
                            }[currentSetting]}
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder={`Введите ${
                                currentSetting === 'phone' ? 'номер телефона (+7XXXXXXXXXX)' : 
                                currentSetting === 'email' ? 'email' : 'данные карты'
                            }`}
                            className={error ? s.inputError : ''}
                        />
                        
                        {error && (
                            <div className={s.errorMessage}>
                                <i className={`fa-solid fa-circle-exclamation ${s.errorIcon}`}></i>
                                <span>{error}</span>
                            </div>
                        )}
                        
                        <div className={s.modalButtons}>
                            <button 
                                onClick={closeModal} 
                                className={s.cancelButton}
                                disabled={isLoading}
                            >
                                Отмена
                            </button>
                            <button 
                                onClick={handleSubmit} 
                                disabled={isLoading}
                                className={s.saveButton}
                            >
                                {isLoading ? (
                                    <>
                                        <i className={`fa-solid fa-spinner ${s.spinner}`}></i>
                                        Сохранение...
                                    </>
                                ) : 'Сохранить'}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className={s.modalTitle}>Подтвердите удаление аккаунта</h2>
                        <p className={s.deleteWarning}>
                            Это действие нельзя отменить. Все ваши данные будут удалены безвозвратно.
                        </p>
                        
                        {error && (
                            <div className={s.errorMessage}>
                                <i className={`fa-solid fa-circle-exclamation ${s.errorIcon}`}></i>
                                <span>{error}</span>
                            </div>
                        )}
                        
                        <div className={s.modalButtons}>
                            <button 
                                onClick={closeModal} 
                                className={s.cancelButton}
                                disabled={isLoading}
                            >
                                Отмена
                            </button>
                            <button 
                                onClick={handleSubmit} 
                                disabled={isLoading} 
                                className={s.deleteButton}
                            >
                                {isLoading ? (
                                    <>
                                        <i className={`fa-solid fa-spinner ${s.spinner}`}></i>
                                        Удаление...
                                    </>
                                ) : 'Удалить аккаунт'}
                            </button>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    )
}

export default Profile;