import s from './story.module.scss'

const StoryItem = () =>{
    return(
        <div className={s.item}>
            <div className={s.item__info}>
                <h5 className={s.item__info__date}>
                    13 марта 2025, 17:58
                </h5>
                <h6 className={s.item__info__auto}>
                    VW Polo
                </h6>
            </div>
            <div className={s.item__price}>
                1488 <i className="fa-solid fa-ruble-sign"></i>
            </div>
        </div>
    )
}

const Story = () =>{
    return(
        <section className={s.story}>
            <h1>История поездок</h1>
            <main className={s.story__list}>
                <StoryItem />
            </main>
        </section>
    )
}

export default Story;