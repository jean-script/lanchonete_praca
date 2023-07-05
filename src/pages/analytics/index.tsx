import { useEffect, useContext, useState } from 'react'
import { Header } from "@/components/Header";
import Head from "next/head";

import { PedidosContext } from '@/contexts/Pedidos'

import styles from './styles.module.scss';
import { Pedido } from "@/components/Pedido";

import formatCurrency from '@/ultis/formatCurrecy';

import { format } from 'date-fns';


export default function Analytics(){

    const { pedidos, loadPedidos, setPedidos }:any = useContext(PedidosContext);

    const [mese, setMeses] = useState(['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'])
    const [mesSelecionado, setMesSelecionado] = useState(0);
    const [pedidosSave, setPedidosSave]= useState(pedidos || [])

    useEffect(()=>{
        loadPedidos('finalizado');  
        handleFiltrar(mesSelecionado)         
        
    },[])
    
    const totalPrice = pedidosSave.reduce((acc:number, item:any )=>{
        return item.total + acc;
    }, 0);

    function handleFiltrar(messele:number){
        setPedidosSave(pedidos)
        let data = pedidos.filter((ped:any)=> format( new Date(ped.createdFormat), 'd') == String(messele));
        setPedidosSave(data)   

        console.log(pedidosSave);
        
    }

    function hendleCustomerChange(e:any){
        setMesSelecionado(e.target.value);
        console.log(Number(e.target.value) + 1);
        
        handleFiltrar(Number(e.target.value) + 1)
    }

    return (
        <>
            <Head>
                <title>Analytics de pedidos - lanchonete Praça</title>
            </Head>

            <Header/>
            <main className={styles.main}>
               <div className={styles.container}>

                    <section className={styles.filtros}>
                        <label>Escolha o mês: </label>
                        <select value={mesSelecionado} onChange={hendleCustomerChange}>
                            {mese.map((mes, index)=>(
                                <option key={index} value={index}>{mes}</option>
                            ))}
                        </select>
                    </section>

                    <section className={styles.infosVendas}>
                        <article className={styles.totalValor} > 
                            <span>Valores vendidos</span>
                            <h1>{ formatCurrency(totalPrice, "BRL")}</h1>
                        </article>

                        <article className={styles.totalValor} > 
                            <span>Vendas</span>
                            <h1>{ pedidosSave.length }</h1>
                        </article>
                    </section>

                    {/* mostrando todos os pedidos */}
                    {pedidos.length <=0 ? (
                        <>
                            <span className={styles.sempedidos}>Sem pedidos</span>
                        </>
                    ): ""}
                    {pedidosSave.map((pedido:any)=> (
                        <Pedido key={pedido.id} data={pedido}/>
                    ))}
                    
                </div>
            </main>
        </>
    )
}
