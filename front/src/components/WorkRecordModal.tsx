import {type ChangeEvent, type FormEvent, useEffect, useState} from "react";
import type {CreateEntryType, WorkType} from "../types/EntryType.ts";
import {$api} from "../shared/api.ts";

type ModalProps = {
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void,
    form: CreateEntryType,
    setForm: (value: CreateEntryType) => void,
    setFormValue: (value: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
    handleCancel: () => void,
    errors: Record<string, string>,
    editingId: number | null
}

export const WorkRecordModal = ({
                                    errors,
                                    editingId,
                                    handleCancel,
                                    form,
                                    setFormValue,
                                    handleSubmit,
                                }: ModalProps) => {
    const [workType, setWorkType] = useState<WorkType[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const {data} = await $api.get<WorkType[]>('/work-type')
            console.log(data, 'wt')
            setWorkType(data)
        }
        fetchData()
    }, [])

    return (
        <div onClick={handleCancel} className="form-modal">
            <div onClick={e => e.stopPropagation()} className="form-card">
                <h2 className="form-title">{editingId ? 'Редактирование записи' : 'Новая запись'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="date">Дата выполнения *</label>
                        <input onChange={setFormValue} value={form.workDate} type="date" id="date" name="workDate"/>
                        {errors.workDate && <p className="error">{errors.workDate}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="work-type">Вид работ *</label>
                        <select onChange={setFormValue} value={form.workTypeId} id="work-type" name="workTypeId">
                            {
                                workType.map((wt: WorkType) => (
                                    <option key={`${wt.id}-worktype`} value={wt.id}>{wt.name}</option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="volume">Объём и единица измерения *</label>
                        <div className="volume-selector">
                            <input onChange={setFormValue} value={form.volume} type="number" id="volume" name="volume"
                                   placeholder="например: 24"/>
                            <select onChange={setFormValue} value={form.unit} name="unit" id="unit">
                                <option value={'м³'}>м³</option>
                                <option value={'м²'}>м²</option>
                            </select>
                        </div>
                        {errors.volume && <p className="error">{errors.volume}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="worker-name">ФИО исполнителя *</label>
                        <input onChange={setFormValue} value={form.executorName} type="text" id="worker-name"
                               name="executorName"
                               placeholder="Иванов И.И."/>
                        {errors.executorName && <p className="error">{errors.executorName}</p>}
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="save-btn">Сохранить</button>
                        <button type="button" className="cancel-btn" onClick={handleCancel}>Отмена</button>
                    </div>
                </form>
            </div>
        </div>
    )
}