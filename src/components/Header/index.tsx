import { useState } from 'react';
import { Link } from 'react-router-dom'
import { history } from '../../services/history';
import { GiHamburgerMenu } from 'react-icons/gi';

import { MenuModal } from "../MenuModal"

import styles from './styles.module.scss';
export function Header() {

    const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);

    function handleMenuModal() {
        setIsMenuModalOpen(!isMenuModalOpen);
    }

    function logOff(){
        localStorage.removeItem('user');
        history.push('/login');
    }

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <Link to="/"><h1>REACTIAN</h1></Link>
                {isMenuModalOpen ? <></>:<GiHamburgerMenu size={20} onClick={handleMenuModal} />}
            </div>

            {isMenuModalOpen && <MenuModal close={handleMenuModal} logOff={logOff} />}

            <ul className={styles.menuNav}>
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/assets">Ativos</Link></li>
                <li onClick={logOff} style={{color: '#ff0000', cursor: 'pointer'}}>Deslogar</li>
            </ul>

        </header>
    )
}