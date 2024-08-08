enum ReportStatus {
    Active,
    Deactive,
    InRevision
}

enum ReportType {
    Fire,
    Water,
    Wind
}

export interface Report {
    code: string,
    content: string,
    created_at: string,
    created: string,
    id: number,
    insured: string,
    sinister: string,
    uid: string,
    reportTypeId: ReportType,
    statusId: ReportStatus
}