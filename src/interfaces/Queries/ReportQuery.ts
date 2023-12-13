import { Report } from "../Models";

export interface IReportQuery {
    GetReports: () => () => Promise<Report[]>,
    // GetReport: (id: number) => Report,
    // CreateReport: (id: number) => Report,
    // UpdateReport: (id: number) => Report,
    // DeleteReport: (id: number) => Report
}