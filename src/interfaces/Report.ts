import { Insured, User } from "./index";

export interface Report {
    _id: string,
    sinister: string,
    insured: string,
    code: string,
    created: string,
    updated: string
}