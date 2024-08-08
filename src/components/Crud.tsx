import { useState, useRef, useMemo } from 'react';
import { Column } from 'primereact/column';
import { CrudProps } from '../interfaces/Props/Crud';
import { DataTable } from 'primereact/datatable';
import { DatatableColumn, Report, User } from '../interfaces/Models';
import { Toast } from 'primereact/toast';
import { useGetReports } from '../hooks/Reports/useReports';
import { Dialog } from 'primereact/dialog';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';

export const Crud = (props: CrudProps<Report>) => {
    const { columns, createForm, modelNamePlural, modelNameSingular } = props;

    const columnsMap = useMemo(() => (
        columns.map((column: DatatableColumn) => (
            <Column dataType={column.type} exportable={column.exportable} field={column.field} header={column.header} key={column.field} sortable={column.sortable}/>
        ))
    ), [columns]);

    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [createDialog, setCreateDialog] = useState<boolean>(false);

    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Report[] | User[]>>(null);

    const { reports, loading } = useGetReports();
     
    const hideDialogs = () => {
        setCreateDialog(false);
    };

    const openCreateDialog = () => {
        setCreateDialog(true);
    };
    
    const leftToolbarTemplate = () => {
         return (
             <div className="dt-buttons">
                 <Button label="Crear" icon="pi pi-plus" severity="success" onClick={openCreateDialog} />
                 <Button label="Eliminar seleccionados" icon="pi pi-trash" severity="danger"/>
             </div>
         );
    };
 
    const rightToolbarTemplate = () => {
         return <Button label="Exportar a csv" icon="pi pi-upload" className="p-button-help" />;
    };

     return (
         <div>
             <Toast ref={toast} />
             <div className="card">
                 <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
                 <DataTable
                         emptyMessage={`No se encontraron ${modelNamePlural}`}
                         loading={loading}
                         ref={dt}
                         value={reports}
                        //  selectionMode='checkbox'
                        //  selection={selectedRows!}
                        //  onSelectionChange={(e) => {
                        //     const value = e.value as Report[] | User[];
                        //     setSelectedRows(value);
                        // }} 
                         dataKey="_id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                         paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                         responsiveLayout='stack'
                         currentPageReportTemplate={`Mostrando {first} a {last} de un total de {totalRecords} ${modelNamePlural}`} globalFilter={globalFilter}
                        //  header={header}
                         >
                            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                            {columnsMap}
                            {/* <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column> */}
                 </DataTable>
             </div>
 
             <Dialog visible={createDialog} style={{ width: '75vw' }} breakpoints={{ '960px': '75vw', '750px': '100vw' }} header={`Crear ${modelNameSingular}`} modal className="p-fluid" onHide={hideDialogs}>
                {createForm}
             </Dialog>
{/*  
             <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                 <div className="confirmation-content">
                     <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                     {product && (
                         <span>
                             Are you sure you want to delete <b>{product.name}</b>?
                         </span>
                     )}
                 </div>
             </Dialog>
 
             <Dialog visible={deleteProductsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                 <div className="confirmation-content">
                     <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                     {product && <span>Are you sure you want to delete the selected products?</span>}
                 </div>
             </Dialog> */}
         </div>
     );
}

