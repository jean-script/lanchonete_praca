import { useEffect, useState } from 'react'
import { Header } from "@/components/Header";
import Head from "next/head";
import Link from "next/link";
import { IoAdd } from 'react-icons/io5';

import styles from './styles.module.scss';
import { Pedido } from "@/components/Pedido";
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/services/firebaseConnection';

const listRef = collection(db, "Mesa");

export default function Dashboard(){

    const [pedidos, setPedidos] = useState([]);

    useEffect(()=>{
        async function loadPedidos(){
            const q = query(listRef, orderBy('created','desc'),where("status","==","preparando"))

            const querySnapshot = await getDocs(q);

            await updateState(querySnapshot);
        }

        loadPedidos();
    },[])

    async function updateState(querySnapshot:any){

        const isCollectionEmpy = querySnapshot.size === 0;
        if(!isCollectionEmpy){
            let lista:any = [];
            querySnapshot.forEach((doc:any) => {
                lista.push({
                    id: doc.id,
                    cliente:doc.data().cliente,
                    numero: doc.data().number,
                    status: doc.data().status,
                    total: doc.data().total,
                    created:doc.data().created
                })
            });
            
            setPedidos(lista);
            console.log(lista);
        }
    }

    return (
        <>
            <Head>
                <title>Dashboard de pedidos - lanchonete Praça</title>
            </Head>

            <Header/>
            <main className={styles.main}>
               <div className={styles.container}>
                    <div className={styles.novoPeiddo}>
                        <Link href='/abrirmesa'>
                            <IoAdd size={25} color="#fff"/>
                            Novo pedido
                        </Link>
                    </div>

                    {/* mostrando todos os pedidos */}
                    {pedidos.map((pedido:any)=> (
                            <Pedido data={pedido}/>
                    ))}
                    
                </div>
            </main>
        </>
    )
}
