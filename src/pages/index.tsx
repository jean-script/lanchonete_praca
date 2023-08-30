import { ChangeEvent, useState, useContext } from 'react'
import Head from 'next/head'
import Image from 'next/image';
import styles from '../styles/Home.module.scss';
import image from '@/../public/lanchonete.jpg';

import { FaRegUser } from 'react-icons/fa';
import { RiLockPasswordFill } from 'react-icons/ri';

import { AuthContext } from '@/contexts/Auth';


export default function Home() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { Login, load }:any = useContext(AuthContext);

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

            <div>
              <FaRegUser size={25} color='#777774' />
              <input type='email' placeholder='Digite seu email' value={email} onChange={(e)=> setEmail(e.target.value)}/>
            </div>
            <div>
              <RiLockPasswordFill size={25} color='#777774' />
              <input type='password' placeholder='Digite sua senha' value={password} onChange={(e)=> setPassword(e.target.value)}/>
            </div>

            <div>
              <button type='submit'>{!load ? "Entrar" : "Carregando..."}</button>
            </div>

          </form>

        </div>
      </main>
    </>
  )
}

