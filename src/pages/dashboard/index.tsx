import { useEffect, useContext } from 'react'
import { Header } from "@/components/Header";
import Head from "next/head";
import Link from "next/link";
import { IoAdd } from 'react-icons/io5';

import { PedidosContext } from '@/contexts/Pedidos'

import styles from './styles.module.scss';
import { Pedido } from "@/components/Pedido";
import { AuthContext } from '@/contexts/Auth';

export default function Dashboard(){

    const { pedidos, loadPedidos, setPedidos }:any = useContext(PedidosContext);
    const { load }:any = useContext(AuthContext);

    useEffect(()=>{
        loadPedidos('preparando')   
        
        return ()=> {
            setPedidos([]);
        }
    },[])


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

                    {pedidos.length <=0 ? (
                        <>
                            <span className={styles.sempedidos}>Sem pedidos</span>
                        </>
                    ): ""}
                    {pedidos.map((pedido:any)=> (
                        <Pedido key={pedido.id} data={pedido}/>
                    ))}
                    
                </div>
            </main>
        </>
    )
}
