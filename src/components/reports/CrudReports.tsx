import { DatatableColumn } from '../../interfaces/Models'
import { Crud } from '../Crud'
import { reportData } from './data';
import { Layout } from '../Layout';
import { ReportForm } from './ReportForm';

export const CrudReports = () => {
    
  const dtColumns: DatatableColumn [] = [
    {
        exportable: false,
        selectionMode: "multiple"
    },
    {
        exportable: false,
        field: "insured",
        header: "Asegurado",
        sortable: true,
        selectionMode: "multiple"
    },
    {
        exportable: false,
        field: "code",
        header: "Código",
        sortable: true,
        selectionMode: "multiple"
    },
    {
        exportable: false,
        field: "sinister",
        header: "Siniestro",
        sortable: true,
        selectionMode: "multiple"
    }
  ]

  return (
    <Layout>
      <Crud columns={dtColumns} createForm={<ReportForm/>} data={reportData} modelNamePlural='Informes' modelNameSingular='Informe'/>
    </Layout>
  )
}
