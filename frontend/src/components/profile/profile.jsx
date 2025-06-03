import { SassColor } from 'sass';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './profile.module.scss';

const SettingData = ({props, customClass}) =>{
    return(
        <button className={s.setting} onClick={props.handleClick}>
            <div className={s.setting__info}>
                <i className={props.icon  + ' ' + customClass}></i>
                <div className={s.setting__wrapper}>
                    <h5 className={s.setting__title + ' ' + customClass}>{props.title}</h5>
                    <h6 className={s.setting__subtitle + ' ' + customClass}>{props.subtitle}</h6>
                </div>
            </div>
            <i className={"fa-solid fa-angle-right"  + ' ' + customClass}></i>
        </button>
    )
}

const Profile = () =>{

    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    

    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('http://localhost:3001/api/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) throw new Error('Ошибка загрузки данных');
          
          const data = await response.json();
          setUserData(data.rows[0]);
          console.log(data.rows[0])
        } catch (error) {
          localStorage.removeItem('token');
          navigate('/Registration');
        }
      };
      
      fetchProfile();
    }, [navigate]);
    let profile_settings = [
        {
            icon: "fa-solid fa-phone",
            title: "Номер телефона",
            subtitle:  'Добавьте номер'
            // userData.phone ? userData.phone : 
        },
        {
            icon: "fa-solid fa-envelope",
            title: "Email",
            subtitle: 'Добавьте почту'
            //  userData.email ? userData.email :
        },   
        {
            icon: "fa-solid fa-credit-card",
            title: "Способы оплаты",
            subtitle:  'Добавьте карту'
        // userData.pay ? userData.pay :
        },   
    ]

    const handleLogOut = () =>{
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    if (!userData) return <div>Загрузка...</div>;
    return(
        <div className={s.profile}>
            <h1>{userData.fio}</h1>
            <div className={s.profile__wrapper}>
                {profile_settings.map((item, key) =>(
                    <SettingData props={item} key={key}/>
                ))}
            </div>
            <div className={s.profile__wrapper}>
            <SettingData props={
                {
                    icon: "fa-solid fa-trash",
                    title: "Удалить аккаунт",      
                } 
            }
            customClass={s.redBtn} 
            />
            <SettingData props={
                {
                    icon: "fa-solid fa-xmark",
                    title: "Выйти из аккаунта",
                    handleClick: handleLogOut 
                } 
            } 
            />
            </div>
        </div>
    )
}

export default Profile;