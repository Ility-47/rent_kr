import s from './support.module.scss'

const Support = () =>{
    return(
        <section className={s.support}>
            <h1>Поддержка</h1>
            <form>
                <div className={s.form__wrapper}>
                    <label htmlFor="type_problem">Выберите тип обращения</label>
                    <select name="type_problem" id="">
                        <option value="">Новое повреждение</option>
                        <option value="">Мусор в салоне</option>
                        <option value="">Грязный салон</option>
                        <option value="">ДТП</option>
                        <option value="">Проблемы с автомобилем</option>
                    </select>
                </div>
                <div className={s.form__wrapper}>
                    <label htmlFor="problem">Опишите свою проблему</label>
                    <textarea name="problem" id=""></textarea>
                    <button type='submit'>Отправить</button>
                </div>
            </form>
        </section>
    )
}

export default Support;