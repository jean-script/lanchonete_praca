import { useContext } from 'react';
import { AuthContext } from '@/contexts/Auth'
import Link from 'next/link';
import styles from './styles.module.scss';

import { FiLogOut } from 'react-icons/fi';

export function Header(){

    const { Logout } = useContext(AuthContext);

    function handleSair(){
        Logout();
    }

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <Link href='/dashboard'>
                        <h1>Lanchonete da praça</h1>
                    </Link>
                </div>

                <div className={styles.nav}>
                    <nav>
                        <Link href='/produtos'>Novo produto</Link>
                        <Link href='/categoria'>Categoria</Link>
                        <Link href='/createuser'>Criar Usuário</Link>
                    </nav>

                    <button onClick={()=> handleSair()}>
                        <FiLogOut size={25} color='#fff' />
                    </button>

                </div>

            </div>
        </header>
    )
}
