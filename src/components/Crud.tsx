import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable, DataTableSelectionChangeEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { ProductService } from '../services/ProductService';
import { DatatableColumn, Report, User } from '../interfaces';
import { Link } from 'react-router-dom';

interface Product {
  id: string | null;
  code: string;
  name: string;
  description: string;
  image: string | null;
  price: number;
  category: string | null;
  quantity: number;
  inventoryStatus: string;
  rating: number;
}

interface CrudProps {
    columns: DatatableColumn[],
    createForm: React.ReactNode,
    data: Report[] | User[]
    modelNameSingular: string,
    modelNamePlural: string
}
export const Crud = (props: CrudProps) => {
    const { columns, createForm, data, modelNameSingular, modelNamePlural } = props;

    let emptyProduct: Product = {
        id: null,
        code: '',
        name: '',
        image: null,
        description: '',
        category: null,
        price: 0,
        quantity: 0,
        rating: 0,
        inventoryStatus: 'INSTOCK',
     };
 
     const [products, setProducts] = useState<Product[]>([]);
     const [productDialog, setProductDialog] = useState<boolean>(false);
     const [deleteProductDialog, setDeleteProductDialog] = useState<boolean>(false);
     const [deleteProductsDialog, setDeleteProductsDialog] = useState<boolean>(false);
     const [product, setProduct] = useState<Product>(emptyProduct);
     const [selectedRows, setSelectedRows] = useState<Report[] | User[] | null>(null);
     const [submitted, setSubmitted] = useState<boolean>(false);
     const [globalFilter, setGlobalFilter] = useState<string>('');
     const toast = useRef<Toast>(null);
     const dt = useRef<DataTable<Report[] | User[]>>(null);
 
     useEffect(() => {
         ProductService.getProducts().then((data: any) => setProducts(data));
     }, []);
 
     const formatCurrency = (value: number) => {
         return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
     };
 
     const openNew = () => {
         setProduct(emptyProduct);
         setSubmitted(false);
         setProductDialog(true);
     };
 
     const hideDialog = () => {
         setSubmitted(false);
         setProductDialog(false);
     };
 
     const hideDeleteProductDialog = () => {
         setDeleteProductDialog(false);
     };
 
     const hideDeleteProductsDialog = () => {
         setDeleteProductsDialog(false);
     };
 
     const saveProduct = () => {
         setSubmitted(true);
 
         if (product.name.trim()) {
             let _products = [...products];
             let _product = { ...product };
 
             if (product.id) {
                 const index = findIndexById(product.id);
 
                 _products[index] = _product;
                 toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
             } else {
                 _product.id = createId();
                 _product.image = 'product-placeholder.svg';
                 _products.push(_product);
                 toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
             }
 
             setProducts(_products);
             setProductDialog(false);
             setProduct(emptyProduct);
         }
     };
 
     const editProduct = (product: Product) => {
         setProduct({ ...product });
         setProductDialog(true);
     };
 
     const confirmDeleteProduct = (product: Product) => {
         setProduct(product);
         setDeleteProductDialog(true);
     };
 
     const deleteProduct = () => {
         let _products = products.filter((val) => val.id !== product.id);
 
         setProducts(_products);
         setDeleteProductDialog(false);
         setProduct(emptyProduct);
         toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
     };
 
     const findIndexById = (id: string) => {
         let index = -1;
 
         for (let i = 0; i < products.length; i++) {
             if (products[i].id === id) {
                 index = i;
                 break;
             }
         }
 
         return index;
     };
 
     const createId = (): string => {
         let id = '';
         let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
 
         for (let i = 0; i < 5; i++) {
             id += chars.charAt(Math.floor(Math.random() * chars.length));
         }
 
         return id;
     };
 
     const exportCSV = () => {
         dt.current?.exportCSV();
     };
 
     const confirmDeleteSelected = () => {
         setDeleteProductsDialog(true);
     };
 
    //  const deleteselectedRows = () => {
    //      let _products = props.data.filter((val) => !selectedRows.includes(val));
 
    //      setProducts(_products);
    //      setDeleteProductsDialog(false);
    //      setSelectedRows([]);
    //      toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    //  };
 
     const onCategoryChange = (e: RadioButtonChangeEvent) => {
         let _product = { ...product };
 
         _product['category'] = e.value;
         setProduct(_product);
     };
 
     const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
         const val = (e.target && e.target.value) || '';
         let _product = { ...product };
 
         // @ts-ignore
         _product[`${name}`] = val;
 
         setProduct(_product);
     };
 
     const onInputNumberChange = (e: InputNumberChangeEvent, name: string) => {
         const val = e.value || 0;
         let _product = { ...product };
 
         // @ts-ignore
         _product[`${name}`] = val;
 
         setProduct(_product);
     };
 
     const leftToolbarTemplate = () => {
         return (
             <div className="dt-buttons">
                 <Button label="Crear" icon="pi pi-plus" severity="success" onClick={openNew} />
                 <Button label="Eliminar seleccionados" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedRows || !selectedRows.length} />
             </div>
         );
     };
 
     const rightToolbarTemplate = () => {
         return <Button label="Exportar a csv" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
     };
 
     const imageBodyTemplate = (rowData: Product) => {
         return <img src={`https://primefaces.org/cdn/primereact/images/product/${rowData.image}`} alt={rowData.image!} className="shadow-2 border-round" style={{ width: '64px' }} />;
     };
 
     const priceBodyTemplate = (rowData: Product) => {
         return formatCurrency(rowData.price);
     };
 
     const ratingBodyTemplate = (rowData: Product) => {
         return <Rating value={rowData.rating} readOnly cancel={false} />;
     };
 
     const statusBodyTemplate = (rowData: Product) => {
         return <Tag value={rowData.inventoryStatus} severity={getSeverity(rowData)}></Tag>;
     };
 
     const actionBodyTemplate = (rowData: Product) => {
         return (
             <div className="dt-buttons">
                 <Button icon="pi pi-pencil" tooltip="Editar" tooltipOptions={{ position: 'bottom' }} size="small" rounded text raised onClick={() => editProduct(rowData)} />
                 <Button icon="pi pi-file-word" tooltip="Imprimir docx" tooltipOptions={{ position: 'bottom' }} size="small" rounded text raised severity="info" onClick={() => confirmDeleteProduct(rowData)} />
                 <Button icon="pi pi-trash" tooltip="Eliminar" tooltipOptions={{ position: 'bottom' }} size="small" rounded text raised severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
             </div>
         );
     };
 
     const getSeverity = (product: Product) => {
         switch (product.inventoryStatus) {
             case 'INSTOCK':
                 return 'success';
 
             case 'LOWSTOCK':
                 return 'warning';
 
             case 'OUTOFSTOCK':
                 return 'danger';
 
             default:
                 return null;
         }
     };
 
     const header = (
         <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
             <h4 className="m-0">Gestión de {modelNamePlural}</h4>
             <span className="p-input-icon-left">
                 <i className="pi pi-search" />
                 <InputText type="search" placeholder="Buscar..." onInput={(e) => {const target = e.target as HTMLInputElement; setGlobalFilter(target.value);}}  />
             </span>
         </div>
     );
     const productDialogFooter = (
         <React.Fragment>
             <Button label="Confirmar" icon="pi pi-check" onClick={saveProduct} />
         </React.Fragment>
     );
     const deleteProductDialogFooter = (
         <React.Fragment>
             <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
             <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
         </React.Fragment>
     );
     const deleteProductsDialogFooter = (
         <React.Fragment>
             <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductsDialog} />
             {/* <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteselectedRows} /> */}
         </React.Fragment>
     );
 
     return (
         <div>
             <Toast ref={toast} />
             <div className="card">
                 <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
                 <DataTable
                         emptyMessage={`No se encontraron ${modelNamePlural}`}
                         ref={dt}
                         value={data}
                         selectionMode='checkbox'
                         selection={selectedRows!}
                         onSelectionChange={(e) => {
                            const value = e.value as Report[] | User[];
                            setSelectedRows(value);
                        }} 
                         dataKey="_id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                         paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                         responsiveLayout='stack'
                         currentPageReportTemplate={`Mostrando {first} a {last} de un total de {totalRecords} ${modelNamePlural}`} globalFilter={globalFilter} header={header}>
                            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                            {
                                columns.map((column: DatatableColumn) => (
                                    <Column exportable={column.exportable} field={column.field} header={column.header} key={column.field} sortable={column.sortable}/>
                                ))
                            }
                            <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                 </DataTable>
             </div>
 
             <Dialog visible={productDialog} style={{ width: '75vw' }} breakpoints={{ '960px': '75vw', '750px': '100vw' }} header={`Crear ${modelNameSingular}`} modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                {createForm}
             </Dialog>
 
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
             </Dialog>
         </div>
     );
}

