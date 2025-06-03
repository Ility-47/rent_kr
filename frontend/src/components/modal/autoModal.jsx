import s from './autoModal.module.scss'
import a from '../auto/auto.module.scss'
import { useState, useEffect } from 'react'

const AutoModal = ({ car, onClose, image }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [rentType, setRentType] = useState('minute');
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        if (startDate) {
            const start = new Date(startDate);
            let end = new Date(start);

            if (rentType === 'minute') {
                end.setMinutes(start.getMinutes() + 15); // по умолчанию +15 минут
            } else if (rentType === 'hour') {
                end.setHours(start.getHours() + 1);
                end.setMinutes(start.getMinutes());
            } else if (rentType === 'day') {
                end.setDate(start.getDate() + 1);
                end.setHours(start.getHours());
                end.setMinutes(start.getMinutes());
            }

            setEndDate(end.toISOString().slice(0, 16));
        }
    }, [startDate, rentType]);

    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            let diffInMs = end - start;
            let price;

            if (rentType === 'minute') {
                price = (diffInMs / (1000 * 60)) * car.price_min;
            } else if (rentType === 'hour') {
                price = (diffInMs / (1000 * 60 * 60)) * car.price_hour;
            } else if (rentType === 'day') {
                const days = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
                price = days * car.price_day;
            }

            setTotalPrice(Math.max(price || 0, 0).toFixed(2));
        }
    }, [startDate, endDate, rentType, car]);
    console.log(car.image)
    return (
        <div className={s.modal}>
            <div className={s.modal__content}>
                <button className={s.closeBtn} onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
                <div className={a.auto}>
                    <div className={a.auto__info}>
                        <h5 className={a.auto__info__name}>
                            {car.name}
                        </h5>
                        <h6 className={a.auto__info__num}>
                            {car.gov_num}
                        </h6>
                    </div>
                    <div className={a.auto__price}>
                        <div className={a.auto__price__wrapper}>
                            <span>Цена за минуту</span>
                            <span>{car.price_min} <i className="fa-solid fa-ruble-sign"></i></span>
                        </div>
                        <div className={a.auto__price__wrapper}>
                            <span>Цена за час</span>
                            <span>{car.price_hour} <i className="fa-solid fa-ruble-sign"></i></span>
                        </div>
                        <div className={a.auto__price__wrapper}>
                            <span>Цена за день</span>
                            <span>{car.price_day} <i className="fa-solid fa-ruble-sign"></i></span>
                        </div>
                    </div>
                    <img src={image} alt="" />
                </div>



                <label>
                    Тип аренды:
                    <select value={rentType} onChange={(e) => setRentType(e.target.value)}>
                        <option value="minute">Минута</option>
                        <option value="hour">Час</option>
                        <option value="day">День</option>
                    </select>
                </label>

                <label>
                    Дата начала аренды:
                    <input
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </label>

                <label>
                    Дата завершения аренды:
                    <input
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate}
                    />
                </label>

                <p><strong>Итоговая цена:</strong> {totalPrice} ₽</p>

                <button className={s.confirmBtn}>Подтвердить аренду</button>
            </div>
        </div>
    );
};

export default AutoModal;
