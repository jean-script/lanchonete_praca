import { useEffect, useState, useContext } from 'react'

import { db } from '@/services/firebaseConnection';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';

import styles from './styles.module.scss';

import formatCurrency from '@/ultis/formatCurrecy';

import { TableContext } from '@/contexts/Table'

interface PedidosProps {
    data:{
        id: string,
        cliente:string,
        numero: string,
        status: string,
        total: number,
        created:Date ,  
    },
}

interface ItemsProps {
    id:string,
    produtoNome:string,
    produtoDesc: string,
    qtd: number,
    price: number,
    mesaId:string,
}

const listRef = collection(db, "items");

export function Pedido({data}:PedidosProps){

    const [ items, setItems ] = useState([]);
    const { PedidoFinalizado }:any = useContext(TableContext);

    useEffect(()=>{
        async function loadItems() {
            
            const q = query(listRef, orderBy('produtoNome','desc'),where("mesaId","==",data.id));
            const querySnapshot = await getDocs(q);

            await updateState(querySnapshot);

        }

        loadItems()
    },[])

    async function updateState(querySnapshot:any){

        const isCollectionEmpy = querySnapshot.size === 0;
        if(!isCollectionEmpy){
            let lista:any = [];
            querySnapshot.forEach((doc:any) => {
                lista.push({
                    id: doc.id,
                    produtoNome:doc.data().produtoNome,
                    produtoDesc: doc.data().produtoDesc,
                    qtd: doc.data().qtd,
                    price: doc.data().price,
                    mesaId:doc.data().mesaId,
                })
            });
            
            setItems(lista);
        }
    }

    function handlefecharMesa(data:any){
        PedidoFinalizado(data)
    }

    return (
        <article className={styles.container}>
            
            <div className={styles.divisor}/>

            <div className={styles.content}>

                <h3>Numéro do pedido: {data.numero}</h3>

                <table>
                    <thead>
                        <tr>
                            <th scope="col">Produto</th>
                            <th scope="col">Descrição</th>
                            <th scope="col">Quant</th>
                            <th scope="col">Preço</th>
                            <th scope="col">Total</th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((item:ItemsProps, index)=>(
                            <tr key={index}>
                                <td data-label="Produto">{item.produtoNome}</td>
                                <td data-label="Descrição">{item.produtoDesc}</td>
                                <td data-label="Quant">{item.qtd}</td>
                                <td data-label="Preço">{formatCurrency(item.price, "BRL")}</td>
                                <td data-label="Total">{formatCurrency(item.price * item.qtd, "BRL")}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
                
                <div className={styles.footerMesa}>
                    <span>
                        <strong>Total Pedido: {formatCurrency(data.total, "BRL")}</strong>
                    </span>
                    <button onClick={()=> handlefecharMesa(data)}>Fechar mesa</button>
                </div>
            </div>

        </article>
    )
}
