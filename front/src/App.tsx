import {type ChangeEvent, type FormEvent, useEffect, useState} from 'react';
import {WorkRecordModal} from "./components/WorkRecordModal";
import type {CreateEntryType, Entry} from "./types/EntryType.ts";
import {$api} from "./shared/api.ts";
import {formatDate} from "./shared/formatDate.ts";

function App() {
    const [isActiveModal, setIsActiveModal] = useState(false)
    const initialForm = {
        executorName: '',
        volume: 0,
        unit: 'м³',
        workDate: '',
        workTypeId: 1
    }

    const [form, setForm] = useState<CreateEntryType>(initialForm);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [filterDate, setFilterDate] = useState<string>('');

    const [editingId, setEditingId] = useState<number | null>(null);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!form.executorName.trim()) {
            newErrors.executorName = 'Введите ФИО';
        }

        if (!form.workDate) {
            newErrors.workDate = 'Выберите дату';
        }

        if (!form.workTypeId) {
            newErrors.workTypeId = 'Выберите вид работ';
        }

        if (!form.volume || isNaN(Number(form.volume)) || Number(form.volume) <= 0) {
            newErrors.volume = 'Введите корректный объём';
        }

        return newErrors;
    };

    const setFormValue = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = event.target;
        setForm({
            ...form,
            [name]: value
        })

        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    }

    const [records, setRecords] = useState<Entry[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const {data} = await $api.get<Entry[]>('/records', {
                params: filterDate ? {date: filterDate} : {}
            });
            setRecords(data)
        }
        fetchData()
    }, [filterDate])

    const handleToggleModal = () => {
        setIsActiveModal(!isActiveModal);
    }

    const clearForm = () => {
        setForm(initialForm)
        setErrors({})
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (editingId) {
            const {data} = await $api.patch(`/records/${editingId}`, {
                ...form,
                workDate: new Date(form.workDate),
            });

            setRecords(prev =>
                prev.map(rec => rec.id === editingId ? data : rec)
            );

            setEditingId(null);
        } else {
            const {data} = await $api.post('/records', {
                ...form,
                workDate: new Date(form.workDate),
            });

            setRecords(prev => [data, ...prev]);
        }

        clearForm();
        setIsActiveModal(false);
    };

    const handleCancel = () => {
        clearForm()
        handleToggleModal()
    }

    const handleDelete = async (id: number) => {
        const res = await $api.delete<Entry>(`/records/${id}`)
        setRecords(prev => prev.filter(rec => rec.id !== id))
        return res
    }

    const handleEdit = (record: Entry) => {
        setForm({
            executorName: record.executorName,
            volume: record.volume,
            unit: record.unit,
            workDate: String(record.workDate).split('T')[0],
            workTypeId: record.workTypeId
        })
        setEditingId(record.id)
        setIsActiveModal(true)
    }

    return (
        <div>
            <div className="worklog-container">
                <h1 className="worklog-title">Журнал работ</h1>

                <div className="worklog-controls">
                    <div className="filter-group">
                        <label htmlFor="filter-date">Фильтр по дате:</label>
                        <input type="date" value={filterDate} id="filter-date"
                               onChange={(e) => setFilterDate(e.target.value)}/>
                        <button className="clear-filter-btn" onClick={() => setFilterDate('')}>Сбросить фильтр</button>
                    </div>
                    <button onClick={handleToggleModal} className="add-record-btn">+ Добавить запись</button>
                </div>


                {
                    isActiveModal &&
                    <WorkRecordModal
                        editingId={editingId}
                        errors={errors}
                        handleCancel={handleCancel}
                        setFormValue={setFormValue}
                        form={form}
                        setForm={setForm}
                        handleSubmit={handleSubmit}
                    />
                }

                <div className="table-wrapper">
                    <table className="work-table">
                        <thead>
                        <tr>
                            <th>Дата выполнения</th>
                            <th>Наименование вида работ</th>
                            <th>Объём с ед. изм.</th>
                            <th>ФИО исполнителя</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            records.map((record: Entry) => (
                                <tr key={record.id}>
                                    <td>{formatDate(record.workDate)}</td>
                                    <td>{record.workType.name}</td>
                                    <td>{record.volume} {record.unit}</td>
                                    <td>{record.executorName}</td>
                                    <td className="actions-cell">
                                        <button className="edit-btn" onClick={() => handleEdit(record)}>✏️</button>
                                        <button className="delete-btn" onClick={() => handleDelete(record.id)}>🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }

                        {
                            !records.length && <tr>
                                <td colSpan={5} className="empty-message">Нет записей</td>
                            </tr>
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default App;