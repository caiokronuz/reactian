import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

interface Props{
    close: () => void;
    logOff: () => void;
}

export function MenuModal({close, logOff}: Props ){
    return(
        <div className={styles.modal} onClick={close}>
            <ul>
                <li onClick={close}>X</li>
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/assets">Ativos</Link></li>
                <li onClick={logOff} style={{color: '#ff0000'}}>Deslogar</li>
            </ul>
        </div>
    )
}