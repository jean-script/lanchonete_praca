import { useContext, useState } from 'react';
import HeaderVertical from "@/components/HeaderVertical";
import { AuthContext } from "@/contexts/Auth";
import Head from "next/head";

import styles from './styles.module.scss';
import Image from 'next/image';

import AvatarImage from '@/assets/avatar.png'; 
import { IoAdd } from 'react-icons/io5';

export default function Profile(){
    const { user }:any = useContext(AuthContext);
    const [nome,setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    return(
        <>
            <Head>
                <title>Profile - {user?.nome}</title>
            </Head>
            <HeaderVertical/>
            <main className={styles.main}>
                <section className={styles.container}>
                    <label >
                        <input type="file" accept="image/*" />
                        <Image 
                            src={ user.AvatarImage ? user.AvatarImage : AvatarImage}
                            alt='Foto perfil'
                        />

                        <IoAdd size={35} color="#fff"/>
                    </label>

                    <form className={styles.forms} >
                        <input type='text' placeholder='Digite o nome' value={nome} onChange={(e)=> setNome(e.target.value)}/>
                        <input type='email' placeholder='Digite o email'value={email} onChange={(e)=> setEmail(e.target.value)}/>
                        <input type='password' placeholder='Digite a senha' value={password} onChange={(e)=> setPassword(e.target.value)}/>
                                
                        <button type='submit'>Atualizar </button>

                    </form>
                </section>
            </main>
        </>

    );
}
