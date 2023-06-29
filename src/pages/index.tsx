import { ChangeEvent, useState, useContext } from 'react'
import Head from 'next/head'
import Image from 'next/image';
import styles from '../styles/Home.module.scss';
import image from '@/../public/lanchonete.jpg';

import { AuthContext } from '@/contexts/Auth';
import { GetServerSideProps } from 'next';

export default function Home() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { Login } = useContext(AuthContext);

  async function handleLogin(e:ChangeEvent<HTMLInputElement>){
    e.preventDefault();
    try {

      if (email !== '' && password !=='') {
        Login(email, password)    
      }
      
    } catch (error) {
      setEmail('');
      setPassword('');
    }
  }

  return (
    <>
      <Head>
        <title>Login - lanchonete Praça</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.container} onSubmit={handleLogin}>

          <Image src={image} alt='image de lanche' />
          <form className={styles.forms}>
            <input type='email' placeholder='Digite seu email' value={email} onChange={(e)=> setEmail(e.target.value)}/>
            <input type='password' placeholder='Digite sua senha' value={password} onChange={(e)=> setPassword(e.target.value)}/>

            <button type='submit'>Entrar</button>

          </form>

        </div>
      </main>
    </>
  )
}
export const getServerSideProps: GetServerSideProps = async () => {
  
  return{
    props:{
        
    },
}
}
