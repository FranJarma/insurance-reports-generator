import { allReportsListColumns } from './datatableColumns';
import { Crud } from '../Crud'
import { CrudProps } from '../../interfaces/Props/Crud';
import { Layout } from '../Layout';
import { Report } from '../../interfaces/Models';
import { reportData } from './data';
import { ReportForm } from './ReportForm';

export const CrudReports = () => {

  const crudProps: CrudProps<Report> = {
    columns: allReportsListColumns,
    createForm: <ReportForm/>,
    modelNamePlural: 'Informes',
    modelNameSingular: 'Informe'
  };

  return (
    <Layout>
      <Crud {...crudProps}/>
    </Layout>
  )
}
