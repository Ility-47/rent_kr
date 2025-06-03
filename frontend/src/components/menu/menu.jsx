import s from './menu.module.scss'
import {Link} from 'react-router-dom';
import React, {useState} from 'react';

const Menu = () =>{

    //Получаем пользователя из localStorage
    const userData = JSON.parse(localStorage.getItem('user'))

    const [isActive, setActive] = useState(true);
    const handleMenu = () =>{
        if(isActive){
            setActive(false)
        }else{
            setActive(true)
        }
        
    }
    return(
            <div className={isActive ? s.container + ' ' + s.active : s.container}>
                <div className={s.menu}>
                    <Link to="/Profile" className={s.menu__user} onClick={handleMenu}>
                        <img src="./user.png" alt="" />
                        <h4 className={s.menu__user__name}>{userData ? (userData.fio) : ('Гость')}</h4>
                    </Link>
                    <nav>
                        <Link onClick={handleMenu} to="/Auto">Автомобили</Link>
                        <Link onClick={handleMenu} to="/Story">Мои поездки</Link>
                        <Link onClick={handleMenu} to="/Politic">Политика компании</Link>
                        <Link onClick={handleMenu} to="/Support">Поддержка</Link>
                        <Link onClick={handleMenu} to="/Registration">Регистрация</Link>
                    </nav>
                </div>
                <div className={s.btns}>
                    <button className={isActive ? s.close : s.close + ' ' + s.disabled} onClick={handleMenu}><i className="fa-solid fa-xmark"></i></button>
                    <button className={isActive ? s.open + ' ' + s.disabled : s.open} onClick={handleMenu}><i className="fa-solid fa-bars"></i></button>
                </div>
            </div>
    )
}

export default Menu;