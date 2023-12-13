import React from 'react'
import { DatatableColumn } from '../../interfaces/Models'
import { Crud } from '../Crud'
import { reportData } from './data';
import { Layout } from '../Layout';

export const CrudUsers = () => {
    
  const dtColumns: DatatableColumn [] = [
    {
        exportable: false,
        selectionMode: "multiple"
    },
    {
        exportable: false,
        field: "username",
        header: "Nombre de Usuario",
        sortable: true,
        selectionMode: "multiple"
    },
    {
        exportable: false,
        field: "created",
        header: "Creado por",
        sortable: true,
        selectionMode: "multiple"
    },
    {
        exportable: false,
        field: "updated",
        header: "Actualizado por",
        sortable: true,
        selectionMode: "multiple"
    }
  ]

  return (
    <Layout>
      <Crud columns={dtColumns} createForm={<span>test</span>} data={reportData} modelNamePlural='Usuarios' modelNameSingular='Usuario'/>
    </Layout>
  )
}
