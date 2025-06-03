import s from './auto.module.scss'
import { useState, useEffect } from 'react'
import AutoModal from '../modal/autoModal'
const AutoCard = ({props, onRentClick}) =>{
    let image
   
    if(props.name.trim() == "Volkswagen Polo"){
        image = "./VWPolo.png"
    }else if(props.name.trim() == "Nissan Qashqai"){
        image = "./NissanQashqai.png"
    }else if(props.name.trim() == "Kia Rio X"){
        image = "./kia.png"
    }else if(props.name.trim() == "Toyota Camry"){
        image = "./camry.png"
    }else if(props.name.trim() == "Mercedes e200"){
        image = "./mercedes.png"
    }else if(props.name.trim() == "BMW 320i"){
        image = "./bmw.png"
    }
   

    //Для передачи пропса в модалку 

    return(
        
        <div className={s.auto}>
                <div className={s.auto__info}>
                    <h5 className={s.auto__info__name}>
                        {props.name}
                    </h5>
                    <h6 className={s.auto__info__num}>
                        {props.gov_num}
                    </h6>
                    <button 
                        className={s.auto__info__rent__btn}
                        onClick={() => onRentClick(props, image)}>
                            Арендовать
                    </button>
                </div>
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
                <img src={image} alt="" />                        
        </div>
    )
}

const Auto = () => {
    const [auto, setAuto] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImage, setIsImage] = useState('');

    useEffect(() => {
        getAuto();
    }, []);

    async function getAuto() {
        fetch('http://localhost:3001/api/auto')
            .then(response => response.json())
            .then(data => setAuto(data))
            .catch(err => console.error(err));
    }

    const handleRentClick = (car, image) => {
        setSelectedCar(car);
        setIsModalOpen(true);
        setIsImage(image);
    };

    return (
        <section className={s.container}>
            <h1>Доступные автомобили</h1>
            <div className={s.list}>
                {auto.length > 0 ? (
                    auto.map((item, key) => (
                        <AutoCard
                            props={item}
                            key={key}
                            onRentClick={handleRentClick}
                        />
                    ))
                ) : (
                    "Загрузка..."
                )}
            </div>

            {isModalOpen && selectedCar && (
                <AutoModal
                    car={selectedCar}
                    image={isImage}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </section>
    );
};

export default Auto;