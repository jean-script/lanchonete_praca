import { ChangeEvent, useContext, useState } from 'react'
import Head from "next/head";
import Image from 'next/image';
import image from '@/../public/lanchonete.jpg'
import styles from './styles.module.scss';
import { Header } from "@/components/Header";
import { AuthContext } from '@/contexts/Auth'

export default function CreateUser(){
    const [nome,setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { CreateUser,  }:any = useContext(AuthContext);

    async function handleRegisterUser(event:ChangeEvent<HTMLFormElement>) {
        event.preventDefault();
        if(nome !== '' && email !== '' && password !== ''){
            try {
                await CreateUser(nome, email, password);
                setEmail('');
                setNome('');
                setPassword('')
            } catch (error) {
                setEmail('');
                setNome('');
                setPassword('')
            }
        }
    }

    return(
        <>
            <Head>
                <title>Register Users - Lanchonete da Praça</title>
            </Head>

            <Header/>

            <main className={styles.main}>
                <section className={styles.container} onSubmit={handleRegisterUser}>
                <Image src={image} alt='image de lanche' />
                <form className={styles.forms} >
                    <input type='text' placeholder='Digite o nome' value={nome} onChange={(e)=> setNome(e.target.value)}/>
                    <input type='email' placeholder='Digite o email'value={email} onChange={(e)=> setEmail(e.target.value)}/>
                    <input type='password' placeholder='Digite a senha' value={password} onChange={(e)=> setPassword(e.target.value)}/>
                                
                    <button type='submit'>Cadastrar</button>

                </form>
                </section>

            </main>

        </>
    )
}
