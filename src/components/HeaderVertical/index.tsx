import { useContext, useRef, useState } from 'react';
import { AuthContext } from '@/contexts/Auth';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { FaChartPie, FaPlusSquare, FaUserPlus } from 'react-icons/fa';
import { AiFillHome } from 'react-icons/ai';
import { BiCategory } from 'react-icons/bi';
import { IoMdAddCircle } from 'react-icons/io';

import Image from 'next/image';
import AvatarImage from '@/assets/avatar.png'; 

import styles from './styles.module.scss';

import { TableContext } from '@/contexts/Table';

export default function HeaderVertical(){

    const { user }:any = useContext(AuthContext);
    const { geraNum }:any = useContext(TableContext);
    const [categoriaSelected, setCategoriaSelected] = useState('Home')
    const route = useRouter();

    console.log(route.asPath);

    function handleChangeColorMenuItem(tag:any) {
        setCategoriaSelected(tag)
    }

    function handleChangeCorAndGeraNum(tag:any){
        setCategoriaSelected(tag);
        geraNum();
    }
    
    return (
        <header className={styles.header}>
            <nav className={styles.nav}>

                <Link href='/dashboard'>
                    <h1>Logo</h1>
                </Link>
                <div >
                    <Link 
                        href='/dashboard' 
                        onClick={(e)=> handleChangeColorMenuItem('Home') } 
                        className={ categoriaSelected === 'Home' ? styles.activeMenu : '' } 
                    >
                        <AiFillHome size={20} color={ categoriaSelected === 'Home' ? '#5e5a5a' : '#000'} />
                        <span>Home</span> 
                    </Link>
                    <Link href='/analytics'
                        onClick={(e)=> handleChangeColorMenuItem('Dashboard') } 
                        className={ categoriaSelected === 'Dashboard' ? styles.activeMenu : '' } 
                    >
                        <FaChartPie size={20} color={ categoriaSelected === 'Dashboard' ? '#5e5a5a' : '#000'} />
                        <span>Dashboard</span> 
                    </Link>
                    <Link href='/produtos'
                        onClick={(e)=> handleChangeColorMenuItem('produtos') } 
                        className={ categoriaSelected === 'produtos' ? styles.activeMenu : '' } 
                    >
                        <FaPlusSquare size={20} color={ categoriaSelected === 'Dashboard' ? '#5e5a5a' : '#000'} />
                        <span>Novo produto</span> 
                    </Link>
                    <Link href='/categoria'
                        onClick={(e)=> handleChangeColorMenuItem('categoria') } 
                        className={ categoriaSelected === 'categoria' ? styles.activeMenu : '' } 
                    >
                        <BiCategory size={20} color={ categoriaSelected === 'categoria' ? '#5e5a5a' : '#000'} />
                        <span>Categoria</span> 
                    </Link>
                    <Link href='/createuser'
                        onClick={(e)=> handleChangeColorMenuItem('createuser') } 
                        className={ categoriaSelected === 'createuser' ? styles.activeMenu : '' } 
                    >
                        <FaUserPlus size={20} color={ categoriaSelected === 'createuser' ? '#5e5a5a' : '#000'} />
                        <span>Criar usuário</span> 
                    </Link>     
                    <Link href='/abrirmesa'
                        onClick={(e)=> handleChangeCorAndGeraNum('abrirmesa') } 
                        className={ categoriaSelected === 'abrirmesa' ? styles.activeMenu : '' } 
                    >
                        <IoMdAddCircle size={20} color={ categoriaSelected === 'abrirmesa' ? '#5e5a5a' : '#000'}/>
                        <span>Novo pedido</span> 
                    </Link>     
                </div>

                <Link href='/profile' className={styles.linkProfile}>
                    
                    <Image
                        alt='Foto de perfil'  
                        src={ user.avatarUrl ? user.avatarUrl : AvatarImage}
                        width={50}
                        height={50}
                        quality={100}
                    />
                    <div>
                        <h4>{user.nome}</h4>
                        <span>{user.admin ? 'Admin' : 'User'}</span>
                    </div>
                      
                </Link>
            </nav>
        </header>
    );
}

