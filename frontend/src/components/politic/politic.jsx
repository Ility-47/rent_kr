import s from './politic.module.scss'
import { useState, useEffect } from 'react'

const TableLine = ({ props }) => {
    return (
        <>
            {
                props.error_name ? (
                    <tr>
                        <td>{props.error_name}</td>
                        <td>{props.error_cost}</td>
                    </tr>
                ) : (
                    <tr>
                        <td>{props.car_name}</td>
                        <td>{props.damage_name}</td>
                        <td>{props.repair_cost}</td>
                    </tr>
                )
            }
        </>
    )
}

const Politic = () => {
    //получение данных из базы данных
    const [errorbd, setErrorbd] = useState(false);
    const [damage, setDamage] = useState(false);
    useEffect(() => {
        getError();
        getDamage();
    }, []);
    async function getError() {
        fetch('http://localhost:3001/api/error')
            .then(response => {
                return response.text();
            })
            .then(data => {
                setErrorbd(JSON.parse(data));
            });
    }
    async function  getDamage() {
        fetch('http://localhost:3001/api/damage')
            .then(response => {
                return response.text();
            })
            .then(data => {
                setDamage(JSON.parse(data));
            });
    }

    return (
        <section>
            <h1>Политика компании</h1>
            <h2>Таблицы возможных нарушений</h2>
            <table>
                <tbody>
                    <tr>
                        <td>Нарушение</td>
                        <td>Штраф</td>
                    </tr>
                    {errorbd ? (
                        errorbd.map((item, key) => (
                            <TableLine props={item} key={key} />
                        ))
                    ) :
                        (<tr>
                            <td>Что-то пошло не так</td>
                        </tr>)
                    }

                </tbody>
            </table>
            <h2>Таблица вохможных повреждений</h2>
            <table>
                <tbody>
                    <tr>
                        <td>Название автомобиля</td>
                        <td>Название повреждения</td>
                        <td>Штраф</td>
                    </tr>
                    {damage ? (
                        damage.map((item, key) => (
                            <TableLine props={item} key={key} />
                        ))
                    ) :
                        (<tr>
                            <td>Что-то пошло не так</td>
                        </tr>)
                    }
                </tbody>
            </table>
        </section>
    )
}

export default Politic;
