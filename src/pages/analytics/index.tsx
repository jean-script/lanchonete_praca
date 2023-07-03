import { useEffect, useContext, useState } from 'react'
import { Header } from "@/components/Header";
import Head from "next/head";

import { PedidosContext } from '@/contexts/Pedidos'

import styles from './styles.module.scss';
import { Pedido } from "@/components/Pedido";
import { AuthContext } from '@/contexts/Auth';

import formatCurrency from '@/ultis/formatCurrecy';

import { format } from 'date-fns';


export default function Analytics(){

    const { pedidos, loadPedidos, setPedidos }:any = useContext(PedidosContext);
    const { load }:any = useContext(AuthContext);

    const [dataInicial, SetDataInicial] = useState('');
    const [dataFinal, SetDataFinal] = useState('');
    const [pedidosSave, setPedidosSave] = useState([]);


    useEffect(()=>{
        loadPedidos('finalizado');
        setPedidosSave(pedidos);        
    },[])
    
    const totalPrice = pedidos.reduce((acc:number, item:any )=>{
        return item.total + acc;
    }, 0);

    function handleFiltrar(){
        let data = pedidos.filter((ped:any)=> ped.createdFormat == format(new Date(dataInicial), 'dd/MM/yyyy'));
        setPedidos(data)
    }

    return (
        <>
            <Head>
                <title>Analytics de pedidos - lanchonete Praça</title>
            </Head>

            <Header/>
            <main className={styles.main}>
               <div className={styles.container}>

                    <div className={styles.filtrosInfo}>
                        {/* <input type='datetime-local' value={dataInicial} onChange={(e)=> SetDataInicial(e.target.value)}/>
                        <button onClick={()=> handleFiltrar()} >Filtrar</button> */}
                        { formatCurrency(totalPrice, "BRL")}
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
