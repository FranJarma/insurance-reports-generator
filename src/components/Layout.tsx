import React, { useState } from 'react'
import { Sidebar } from 'primereact/sidebar';
import { HOME_ROUTE, menuItems } from '../constants';
import { BreadCrumb } from 'primereact/breadcrumb';
import { PrimeIcons } from 'primereact/api';
import { Link, useLocation } from 'react-router-dom';
import { MenuItem } from 'primereact/menuitem';
import '../index.css'
import { Avatar } from 'primereact/avatar';

interface LayoutProps {
  children: React.ReactNode
}

interface BreadcrumbItem {
  label: string;
  url: string;
}

const translatePathname = (pathname: string): string => {
  const translations: { [key: string]: string } = {
    'home': 'Home',
    'reports': 'Informes',
    'users': 'Usuarios',
    'create-report': 'Crear Informe',
    'create-user': 'Crear Usuario',
  };

  const parts = pathname.split('/');
  const translatedParts = parts.map((part) => translations[part] || part);

  return translatedParts.join('/');
};

const MyBreadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  if (pathnames[0] === "home") {
    return null;
  }
  const home = { icon: PrimeIcons.HOME, url: HOME_ROUTE };
  const breadcrumbs: BreadcrumbItem[] = [
    ...(pathnames[0] !== 'home' ? [{ label: 'Home', url: '/home' }] : []),
    ...pathnames.map((name, index) => {
      const translatedLabel = translatePathname(name);
      const url = `/${pathnames.slice(0, index + 1).join('/')}`;
      return { label: translatedLabel, url };
    }),
  ];

  return <BreadCrumb model={breadcrumbs} home={home} />;
};

export const Layout = ({children}: LayoutProps) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <React.Fragment>
        <header>
          <i className={PrimeIcons.BARS} onClick={() => setSidebarVisible(!sidebarVisible)}></i>
          <i className={`left ${PrimeIcons.USER}`}></i>
          <i className={PrimeIcons.COG}></i>
          <i className={PrimeIcons.BELL}></i>
        </header>
        <aside>
          <MyBreadcrumb />
          <Sidebar visible={sidebarVisible} onHide={() => setSidebarVisible(false)}>
              <h3>Generador de <b>Informes Periciales</b></h3>
              <ul className='side__menu'>
                {
                  menuItems.map((menuItem: MenuItem) => (
                      <li key={menuItem.label}><Link className='side__menu__link' to={menuItem.url!}><i className={menuItem.icon}></i>{menuItem.label}</Link></li>
                  ))
                }
              </ul>
              <section className='side__user'>
                <Avatar style={{ backgroundColor: '#bcbdf9', color: '#282960' }} icon="pi pi-user" size="large" shape="square" /><span className='side__user__name'>Francisco Jarma</span>
              </section>
          </Sidebar>
        </aside>
        <main>
          {children}
        </main>
    </React.Fragment>
  )
}
