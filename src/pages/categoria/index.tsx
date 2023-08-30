import Head from "next/head";
import { Header } from '../../components/Header'

import styles from './styles.module.scss';
import { ChangeEvent, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/services/firebaseConnection";
import HeaderVertical from "@/components/HeaderVertical";

export default function Categoria(){

    const [categoria, setCategoria] = useState('');

    async function handleCreateCategoria(e:ChangeEvent<HTMLInputElement>){
        e.preventDefault();
        
        if (categoria !== '') {
            await addDoc(collection(db, "Categorias"),{
                created: new Date(),
                categoria:categoria
            }).then(()=>{
                setCategoria('');
            })
        }

    }
    
    return(
        <>
            <Head>
                <title>Registrar categoria - Lanchonete da praça</title>
            </Head>

            <HeaderVertical/>

            <main className={styles.main}>
                <div className={styles.container} onSubmit={handleCreateCategoria}>
                    <h1>Nova Categoria</h1>

                    <form className={styles.forms}>

                        <input value={categoria} onChange={(e)=> setCategoria(e.target.value)} type="text" placeholder="Digite o nome da categoria" />
                        
                        <button type="submit">Cadastrar</button>
                    </form>

                </div>
            </main>
            
        </>
    )
}