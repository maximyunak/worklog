export type Entry = {
    id: number;
    executorName: string;
    volume: number;
    unit: string;
    workDate: Date;
    workType: WorkType
    workTypeId: number;
}

export type WorkType = {
    id: number;
    name: string
}

export type CreateEntryType = {
    executorName: string;
    volume: number;
    unit: string;
    workDate: string;
    workTypeId: number;
}