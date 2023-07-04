import { useContext, useState } from 'react';
import { AuthContext } from '@/contexts/Auth'
import Link from 'next/link';
import styles from './styles.module.scss';

import { AiOutlineHome } from 'react-icons/ai'
import { FiLogOut } from 'react-icons/fi';
import { BiMenu, BiUser} from 'react-icons/bi'
import { TbBrandGoogleAnalytics, TbCategory, TbBrandProducthunt } from 'react-icons/tb';


export function Header(){

    const { Logout, user }:any = useContext(AuthContext);
    const [openMobileMenu, setOpenMobileMenu] = useState(false);

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
                        {user?.admin &&(
                            <>
                                <Link href='/analytics'>Analytics</Link>
                                <Link href='/produtos'>Novo produto</Link>
                                <Link href='/categoria'>Categoria</Link>
                                <Link href='/createuser'>Criar usuário</Link>
                            </>
                        )}
                    </nav>

                    <button onClick={()=> handleSair()}>
                        <FiLogOut size={25} color='#454444' />
                    </button>

                </div>

                <div className={ openMobileMenu ? styles.activeMobile : styles.mobile }>
                    <button onClick={()=> setOpenMobileMenu(!openMobileMenu)}>
                        <BiMenu size={45}/>
                    </button>
                    <nav>

                        <Link href='/dashboard'>
                            <AiOutlineHome size={25}/>
                            Dashboard
                        </Link>
                        {user?.admin &&(
                            <>
                                <Link href='/analytics'>
                                    <TbBrandGoogleAnalytics size={25} />
                                    Analytics
                                </Link>
                            
                                <Link href='/produtos'>
                                    <TbBrandProducthunt size={25} />
                                    Novo produto
                                </Link>
                            
                                <Link href='/categoria'>
                                    <TbCategory size={25} />
                                    Categoria
                                </Link>
                                
                                <Link href='/createuser'>
                                    <BiUser size={25} />
                                    Criar usuário
                                </Link>
                            </>
                        )}
                        
                        <button onClick={()=> handleSair()}>
                            <FiLogOut size={25} color='#454444' /> 
                            <span>Sair</span>
                        </button>
                    </nav>

                </div>

            </div>
        </header>
    )
}
