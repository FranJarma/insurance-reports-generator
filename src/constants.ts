import { MenuItem } from 'primereact/menuitem';
import { PrimeIcons } from 'primereact/api';

export const menuItems: MenuItem [] = [
    {
        icon: PrimeIcons.HOME,
        label: "Inicio",
        url: "/home"
    },
    {
        icon: PrimeIcons.FILE,
        label: "Gestión de Informes",
        url: "/reports"
    },
    {
        icon: PrimeIcons.USER,
        label: "Gestión de Usuarios",
        url: "/users"
    },
    {
        icon: PrimeIcons.CHART_PIE,
        label: "Estadísticas",
        url: "/stats"
    },
    {
        icon: PrimeIcons.QUESTION,
        label: "Preguntas",
        url: "/questions"
    },
    {
        icon: PrimeIcons.SIGN_OUT,
        label: "Cerrar sesión",
        url: "/"
    }
];
export const MANAGE_REPORTS_ROUTE = "/reports";

export const MANAGE_USERS_ROUTE = "/users";

export const HOME_ROUTE = "/home";