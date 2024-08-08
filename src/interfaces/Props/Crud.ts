import React from "react"
import { DatatableColumn } from "../UI/Datatable/DatatableColumn"

export interface CrudProps<T> {
    columns: DatatableColumn[],
    createForm: React.ReactNode,
    data?: T[],
    modelNamePlural: string,
    modelNameSingular: string
}