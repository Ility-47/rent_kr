import s from './story.module.scss';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'https://rent-kr.onrender.com';

const StoryItem = ({ item }) => {

  const formattedDateStart = new Date(item.start).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

const formattedDateFinish = new Date(item.finish).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={s.item}>
      <div className={s.item__info}>
        <h5 className={s.item__info__date}>
          От {formattedDateStart} до {formattedDateFinish}
        </h5>
        <h6 className={s.item__info__auto}>
          {item.name} • {item.gov_num}
        </h6>
      </div>
      <div className={s.item__price}>
        {item.cost} ₽
      </div>
    </div>
  );
};

const Story = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
const userId = JSON.parse(localStorage.getItem('user')).id  
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${API_URL}/api/history/${userId}`);
        if (!response.ok) throw new Error('Ошибка загрузки данных');

        const data = await response.json();
        setHistory(data);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка:', error);
      }
    };

    fetchHistory();
  }, [navigate]);

  if (loading) return <p>Загрузка...</p>;

  return (
    <section className={s.story}>
      <h1>История поездок</h1>
      <main className={s.story__list}>
        {history.length > 0 ? (
          history.map((item, index) => (
            <StoryItem key={index} item={item} />
          ))
        ) : (
          <p>Нет завершённых аренд</p>
        )}
      </main>
    </section>
  );
};

export default Story;