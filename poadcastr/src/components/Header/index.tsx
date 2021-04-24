import format from 'date-fns/format';
import ptbr from 'date-fns/locale/pt-BR';

import styles from './styles.module.scss'

export function Header(){
    const currentDate = format(new Date(),'EEEEEE, d MMM', {
        locale:ptbr
    });
    return(
        <header className={styles.headerContainer}>
            <img src="/logo.svg" alt="Podcaster"/>
            <p>O melhor para voce ouvir sempre</p>

            <span>{currentDate}</span>
        </header>
    );
}