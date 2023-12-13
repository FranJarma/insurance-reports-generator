type UserStatus = "active" | "deactivated"

export interface User {
    _id: string,
    username: string,
    password: string,
    state: UserStatus,
    created: string,
    updated: string
}