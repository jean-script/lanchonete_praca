import { useContext } from 'react';
import { AuthContext } from '@/contexts/Auth';

import Link from 'next/link';

import { FaChartPie, FaPlusSquare, FaUserPlus } from 'react-icons/fa';
import { AiFillHome } from 'react-icons/ai';
import { BiCategory } from 'react-icons/bi';

import Image from 'next/image';
import AvatarImage from '@/assets/avatar.png'; 

import styles from './styles.module.scss';
import { IoAdd } from 'react-icons/io5';
import { TableContext } from '@/contexts/Table';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { IoMdAddCircle } from 'react-icons/io';

export default function HeaderVertical(){

    const { user }:any = useContext(AuthContext);
    const { geraNum }:any = useContext(TableContext);
    const route = useRouter();

    console.log(route.asPath);
    
    return (
        <header className={styles.header}>
            <nav className={styles.nav}>

                <Link href='/dashboard'>
                    <h1>Logo</h1>
                </Link>
                <div>
                    <Link href='/dashboard' >
                        <AiFillHome size={20} color='#000' />
                        <span>Home</span> 
                    </Link>
                    <Link href='/analytics'>
                        <FaChartPie size={20} color='#000' />
                        <span>Dashboard</span> 
                    </Link>
                    <Link href='/produtos'>
                        <FaPlusSquare size={20} color='#000' />
                        <span>Novo produto</span> 
                    </Link>
                    <Link href='/categoria'>
                        <BiCategory size={20} color='#000' />
                        <span>Categoria</span> 
                    </Link>
                    <Link href='/createuser'>
                        <FaUserPlus size={20} color='#000' />
                        <span>Criar usuário</span> 
                    </Link>     
                    <Link href='/abrirmesa' onClick={() => geraNum()}>
                        <IoMdAddCircle size={20} color="#000"/>
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    
    return {
        props: {

        }
    }
}
