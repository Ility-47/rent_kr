import s from './auto.module.scss'
import { useState, useEffect } from 'react'
import AutoModal from '../modal/autoModal'

const AutoCard = ({ props, onClick, isBooked, userId }) => {
    let image
    if (props.name.trim() == "Volkswagen Polo") {
        image = "./VWPolo.png"
    } else if (props.name.trim() == "Nissan Qashqai") {
        image = "./NissanQashqai.png"
    } else if (props.name.trim() == "Kia Rio X") {
        image = "./kia.png"
    } else if (props.name.trim() == "Toyota Camry") {
        image = "./camry.png"
    } else if (props.name.trim() == "Mercedes e200") {
        image = "./mercedes.png"
    } else if (props.name.trim() == "BMW 320i") {
        image = "./bmw.png"
    } else if (props.name.trim() == "Tesla") {
        image = "./tesla.jpg"
    } else if (props.name.trim() == "Lada Granta") {
        image = "./granta.jpg"
    }

    return (
        <div className={`${s.auto} ${isBooked ? s.booked : ''}`}>
            <div className={s.auto__info}>
                <div className={s.auto__info__wrapper}>
                    <h5 className={s.auto__info__name}>
                        {props.name}
                    </h5>
                    <h6 className={s.auto__info__num}>
                        {props.gov_num}
                    </h6>
                    {!isBooked && (
                        <button
                            className={s.auto__info__rent__btn}
                            onClick={() => onClick(props, image)}>
                            Арендовать
                        </button>
                    )}
                    {isBooked && (
                        <button 
                            className={s.auto__info__rent__btn}
                            onClick={() => onClick(props.id, userId)}>
                                Завершить аренду
                        </button>
                    )}
                </div>
                <img src={image} alt="" />
            </div>
            {!isBooked && (
                <div className={s.auto__price}>
                    <div className={s.auto__price__wrapper}>
                        <span>Цена за минуту</span>
                        <span>{props.price_min} <i className="fa-solid fa-ruble-sign"></i></span>
                    </div>
                    <div className={s.auto__price__wrapper}>
                        <span>Цена за час</span>
                        <span>{props.price_hour} <i className="fa-solid fa-ruble-sign"></i></span>
                    </div>
                    <div className={s.auto__price__wrapper}>
                        <span>Цена за день</span>
                        <span>{props.price_day} <i className="fa-solid fa-ruble-sign"></i></span>
                    </div>
                </div>
            )}
        </div>
    )
}

const Auto = () => {
    const [auto, setAuto] = useState([]);
    const [bookedAuto, setBookedAuto] = useState(null);
    const [selectedCar, setSelectedCar] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImage, setIsImage] = useState('');
    const userId = JSON.parse(localStorage.getItem('user')).id
    // Функция загрузки данных
    const loadData = async () => {
        try {
            // 1. Загружаем доступные авто
            const autosResponse = await fetch('http://localhost:3001/api/auto');
            const autosData = await autosResponse.json();
            setAuto(autosData);

            // 2. Загружаем текущую аренду пользователя
            if (userId) {
                const bookedResponse = await fetch(`http://localhost:3001/api/auto/booked/${userId}`);
                const bookedData = await bookedResponse.json();
                setBookedAuto(bookedData.length > 0 ? bookedData[0] : null);
            }
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
    };

    useEffect(() => {
        loadData();
    }, [userId]);

    const handleRentClick = (car, image) => {
        setSelectedCar(car);
        setIsModalOpen(true);
        setIsImage(image);
    };

    const handleConfirmRent = async (rentData) => {
        console.log(rentData)
        try {
            const response = await fetch('http://localhost:3001/api/rent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rentData),
            });

            if (response.ok) {
                // Вместо общего loadData(), обновим только нужные данные
                const autosResponse = await fetch('http://localhost:3001/api/auto');
                const autosData = await autosResponse.json();
                setAuto(autosData);

                const bookedResponse = await fetch(`http://localhost:3001/api/auto/booked/${userId}`);
                const bookedData = await bookedResponse.json();
                setBookedAuto(bookedData.length > 0 ? bookedData[0] : null);

                setIsModalOpen(bookedData);
            } else {
                alert('Ошибка при бронировании автомобиля');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    //завершение аренды

    const onFinishRent = async (carId, clientId) => {
        clientId = Number(clientId)
        try {
            const response = await fetch('http://localhost:3001/api/finish-rent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ carId, clientId }),
            });

            if (response.ok) {
                await loadData(); // Обновляем данные
            } else {
                alert('Ошибка при завершении аренды');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при завершении аренды');
        }
    };
    return (
        <section className={s.container}>
            {!bookedAuto && (<h1>Доступные автомобили</h1>)}

            {/* Блок с текущей арендой */}
            {bookedAuto ? (
                <div className={s.bookedSection}>
                    <h1>Ваш текущий арендованный автомобиль</h1>
                    <AutoCard
                        props={bookedAuto}
                        onClick={onFinishRent}
                        isBooked={true}
                        userId={userId}
                    />
                    {console.log(bookedAuto)}
                </div>
            ) : (
                <div className={s.list}>
                    {auto.length > 0 ? (
                        auto.map((car) => (
                            <AutoCard
                                key={car.id}
                                props={car}
                                onClick={handleRentClick}
                                isBooked={bookedAuto && bookedAuto.id === car.id}
                            />
                        ))
                    ) : (
                        <p>Загрузка...</p>
                    )}
                </div>
            )}
            {isModalOpen && selectedCar && (
                <AutoModal
                    car={selectedCar}
                    image={isImage}
                    onClose={() => setIsModalOpen(false)}
                    userId={userId}
                    onConfirm={handleConfirmRent}
                />
            )}

        </section>
    );
};

export default Auto;

