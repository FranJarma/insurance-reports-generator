export interface DatatableColumn {
    exportable?: boolean,
    field?: string,
    header?: string,
    sortable?: boolean,
    selectionMode?: string,
    type?: 'text' | 'numeric' | 'date' | string | undefined; 
}