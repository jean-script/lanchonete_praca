import { useEffect, useContext, useState } from 'react'
import { Header } from "@/components/Header";
import Head from "next/head";

import { PedidosContext } from '@/contexts/Pedidos'

import styles from './styles.module.scss';
import { Pedido } from "@/components/Pedido";

import formatCurrency from '@/ultis/formatCurrecy';

import { format } from 'date-fns';
import HeaderVertical from '@/components/HeaderVertical';


export default function Analytics(){

    const { pedidos, loadPedidos, setPedidos, loading }:any = useContext(PedidosContext);

    const [mese, setMeses] = useState(['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'])
    const [mesSelecionado, setMesSelecionado] = useState(0);
    const [diaSelected, setDiaSelected] = useState(1);
    const [pedidosSave, setPedidosSave]= useState(pedidos || []);
    const [dias, setDias]:any = useState([]);


    useEffect(()=>{
        loadPedidos('finalizado');  
        handleFiltrar(mesSelecionado)  
        let dia = [];
        for (let index = 1; index <= 31; index++) {
            dia.push(index)
        }       

        setDias(dia);
        setPedidosSave(pedidos) 
        
        return ()=> {
            setDias([]);
            setPedidos([])
        }
    },[])
    
    const totalPrice = pedidosSave.reduce((acc:number, item:any )=>{
        return item.total + acc;
    }, 0);

    function handleFiltrar(messele:number){
        setPedidosSave(pedidos)
        let data = pedidos.filter((ped:any)=> format( new Date(ped.createdFormat), 'd') == String(messele));
        setPedidosSave(data)           
    }

    function handleMesChange(e:any){
        setMesSelecionado(e.target.value);
        handleFiltrar(Number(e.target.value) + 1)
    }

        function handleDayChange(e:any){
        setPedidosSave(pedidos)
        setDiaSelected(e.target.value);
        let data = pedidos.filter((ped:any)=> format( new Date(ped.createdFormat), 'M') == String(e.target.value));
        setPedidosSave(data)   

    }

    return (
        <>
            <Head>
                <title>Analytics de pedidos - lanchonete Praça</title>
            </Head>

            <HeaderVertical/>
            <main className={styles.main}>
               <div className={styles.container}>

                    <section className={styles.filtros}>
                        <label>Escolha o mês: </label>

                        <select value={mesSelecionado} onChange={handleMesChange}>
                            {mese.map((mes, index)=>(
                                <option key={index} value={index}>{mes}</option>
                            ))}
                        </select>

                        <select value={diaSelected} onChange={handleDayChange}>
                            {dias.map((dia:any, index:any)=>(
                                <option key={index}>{dia}</option>
                            ))}
                        </select>

                    </section>
                            
                    <section className={styles.infosVendas}>
                        <article className={styles.totalValor} > 
                            <span>Valores vendidos</span>
                            {loading ? (
                                <>
                                    Carregando...
                                </>
                            ): (
                                <h1>{ formatCurrency(totalPrice, "BRL")}</h1>
                            )}
                        </article>

                        <article className={styles.totalValor} > 
                            <span>Vendas</span>
                            {loading ? (
                                <>
                                    Carregando...
                                </>
                            ):(
                                <h1>{ pedidosSave.length }</h1>
                            )}
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
