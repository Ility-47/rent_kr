import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './admin.module.scss';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('auto');
    const [data, setData] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Поля для каждой таблицы
    const tableFields = {
        auto: [
            { name: 'id', type: 'text', editable: false },
            { name: 'name', type: 'text', editable: true },
            { name: 'color', type: 'text', editable: true },
            { name: 'release_date', type: 'number', editable: true },
            { name: 'type', type: 'text', editable: true },
            { name: 'gov_num', type: 'text', editable: true },
            { name: 'sts', type: 'text', editable: true },
            { name: 'insurance', type: 'text', editable: true },
            { name: 'tarif_id', type: 'number', editable: true },
            { name: 'available', type: 'boolean', editable: true },
        ],
        client: [
            { name: 'id', type: 'text', editable: false },
            { name: 'fio', type: 'text', editable: true },
            { name: 'age', type: 'number', editable: true },
            { name: 'pasport', type: 'text', editable: true },
            { name: 'v_u', type: 'text', editable: true },
            { name: 'rent_count', type: 'number', editable: true },
            { name: 'error_count', type: 'number', editable: true },
        ],
        client_auth: [
            { name: 'id', type: 'text', editable: false },
            { name: 'fio', type: 'text', editable: true },
            { name: 'email', type: 'email', editable: true },
            { name: 'payment_method', type: 'text', editable: true },
            { name: 'phone', type: 'text', editable: true }
        ],
        damage: [
            { name: 'id', type: 'text', editable: false },
            { name: 'car_name', type: 'text', editable: true },
            { name: 'damage_name', type: 'text', editable: true },
            { name: 'repair_cost', type: 'number', editable: true }
        ],
        error: [
            { name: 'id', type: 'text', editable: false },
            { name: 'error_name', type: 'text', editable: true },
            { name: 'error_cost', type: 'number', editable: true }
        ],

    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:3001/api/admin/${activeTab}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    navigate('/admin');
                }
                throw new Error('Ошибка загрузки данных');
            }

            const result = await response.json();
            setData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (row) => {
        setEditingId(row?.id || 'new');
        setFormData(row || {});
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async (e) => {
    e.preventDefault();
    try {
        const isNew = editingId === 'new';
        const url = isNew 
            ? `http://localhost:3001/api/admin/${activeTab}`
            : `http://localhost:3001/api/admin/${activeTab}/${editingId}`;

        const method = isNew ? 'POST' : 'PUT';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Ошибка сохранения');
        
        setEditingId(null);
        setFormData({});
        fetchData();
    } catch (err) {
        setError(err.message);
    }
};

    const handleDelete = async (id) => {
        if (!window.confirm('Вы уверены, что хотите удалить эту запись?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:3001/api/admin/${activeTab}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка удаления данных');
            }

            await fetchData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddNew = () => {
        const newItem = {};
        tableFields[activeTab].forEach(field => {
            if (field.editable) {
                newItem[field.name] = '';
            }
        });
        setFormData(newItem);
        setEditingId('new');
    };

const handleLogout = async () => {
    try {
        const token = localStorage.getItem('adminToken');
        await fetch('http://localhost:3001/api/admin/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        localStorage.removeItem('adminToken');
        navigate('/admin');
    } catch (err) {
        console.error('Logout error:', err);
    }
};



    if (loading && !data.length) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div className={s.adminPanel}>
            <header className={s.header}>
                <h1>Административная панель</h1>
                <button onClick={handleLogout} className={s.logoutBtn}>Выйти</button>
            </header>

            <div className={s.tabs}>
                {Object.keys(tableFields).map(tab => (
                    <button
                        key={tab}
                        className={activeTab === tab ? s.activeTab : ''}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className={s.tableContainer}>
                <button onClick={handleAddNew} className={s.addButton}>
                    Добавить новую запись
                </button>

                <table className={s.dataTable}>
                    <thead>
                        <tr>
                            {tableFields[activeTab].map(field => (
                                <th key={field.name}>{field.name}</th>
                            ))}
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Форма для новой записи */}
                        {editingId === 'new' && (
                            <tr className={s.editingRow}>
                                {tableFields[activeTab].map(field => (
                                    <td key={field.name}>
                                        {field.editable ? (
                                            <input
                                                type={field.type}
                                                name={field.name}
                                                value={formData[field.name] || ''}
                                                onChange={handleInputChange}
                                            />
                                        ) : '-'}
                                    </td>
                                ))}
                                <td>
                                    <button onClick={handleSave}>Сохранить</button>
                                    <button onClick={handleCancelEdit}>Отмена</button>
                                </td>
                            </tr>
                        )}

                        {/* Список существующих записей */}
                        {data.map(row => (
                            <tr key={row.id}>
                                {tableFields[activeTab].map(field => (
                                    <td key={`${row.id}-${field.name}`}>
                                        {editingId === row.id ? (
                                            field.editable ? (
                                                <input
                                                    type={field.type}
                                                    name={field.name}
                                                    value={formData[field.name] || ''}
                                                    onChange={handleInputChange}
                                                />
                                            ) : row[field.name]
                                        ) : row[field.name]}
                                    </td>
                                ))}
                                <td>
                                    {editingId === row.id ? (
                                        <>
                                            <button className={s.table__btn} onClick={handleSave}>Сохранить</button>
                                            <button className={s.table__btn} onClick={handleCancelEdit}>Отмена</button>
                                        </>
                                    ) : (
                                        <>
                                            <button className={s.table__btn} onClick={() => handleEdit(row)}>Изменить</button>
                                            <button className={s.table__btn} onClick={() => handleDelete(row.id)}>Удалить</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPanel;