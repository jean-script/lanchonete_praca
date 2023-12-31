import { useEffect, useContext } from 'react'
import Head from "next/head";
import Link from "next/link";
import { IoAdd } from 'react-icons/io5';

import { PedidosContext } from '@/contexts/Pedidos'

import styles from './styles.module.scss';
import { Pedido } from "@/components/Pedido";
import { GetServerSideProps } from 'next';
import { TableContext } from '@/contexts/Table';
import HeaderVertical from '@/components/HeaderVertical';
import { MdOutlineRemoveShoppingCart } from 'react-icons/md';

export default function Dashboard(){

    const { pedidos, loadPedidos, setPedidos }:any = useContext(PedidosContext);
    const { geraNum }:any = useContext(TableContext);

    useEffect(()=>{
        loadPedidos('preparando') 
        
        return () => {
            setPedidos([]);
        }
    },[])

    return (
        <>
            <Head>
                <title>Dashboard de pedidos - lanchonete Praça</title>
            </Head>

            <main className={styles.main}>
               <div className={styles.container}>
                    <div className={styles.novoPeiddo}>
                        <Link href='/abrirmesa'>
                            <button onClick={()=> geraNum()}>
                                <IoAdd size={25} color="#fff"/>
                                Novo pedido
                            </button>
                        </Link>
                    </div>

                    {/* mostrando todos os pedidos */}
                    {pedidos.length <=0 ? (
                        <>
                            <span className={styles.sempedidos}>
                                <span>
                                    Sem pedidos
                                </span> 
                                <MdOutlineRemoveShoppingCart size={60}/>
                            </span>
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


export const getServerSideProps: GetServerSideProps = async () => {

    return {
        props:{
            
        }
    }

}
