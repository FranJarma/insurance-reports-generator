import { DatatableColumn } from "../../interfaces/Models";

export const allReportsListColumns: DatatableColumn [] = [
    {
        exportable: false,
        selectionMode: "multiple"
    },
    {
        exportable: true,
        field: "insured.full_name",
        header: "Asegurado",
        sortable: true,
        selectionMode: "multiple"
    },
    {
        exportable: true,
        field: "code",
        header: "Código",
        sortable: true,
        selectionMode: "multiple"
    },
    {
        exportable: true,
        field: "sinister",
        header: "Siniestro",
        sortable: true,
        selectionMode: "multiple"
    },
    {
      exportable: true,
      field: "created_date",
      header: "Fecha de creación",
      sortable: true,
      selectionMode: "multiple",
      type: "date"
    }
];