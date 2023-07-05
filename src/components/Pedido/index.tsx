import { useEffect, useState, useContext } from 'react'

import { db } from '@/services/firebaseConnection';
import { collection, deleteDoc, doc, getDocs, orderBy, query, where } from 'firebase/firestore';

import styles from './styles.module.scss';

import formatCurrency from '@/ultis/formatCurrecy';

import { TableContext } from '@/contexts/Table'
import { ProductsContext } from '@/contexts/Products';

interface PedidosProps {
    data:{
        id: string,
        cliente:string,
        numero: string,
        status: string,
        total: number,
        created:Date ,
        createdFormat: string
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
    const { RemoveCarinho }:any = useContext(ProductsContext);

    useEffect(()=>{
        async function loadItems() {
            
            const q = query(listRef, orderBy('produtoNome','desc'),where("mesaId","==",data.id));
            const querySnapshot = await getDocs(q);

            await updateState(querySnapshot);

        }

        loadItems()

        return ()=>{
            setItems([]);
        }
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

    async function handleFecharMesa(idMesa:any){
        items.map(async (item:any)=>{
            RemoveCarinho(item.id, item.id);
            await deleteDoc(doc(db, 'items',item.id)).catch((e)=> console.log(e))
            
        })

        await deleteDoc(doc(db, 'Mesa',idMesa))
    }

    function handleFinalizarPedidio(data:any){
        PedidoFinalizado(data)
    }

    return (
        <article className={styles.container}>

            <section>
                <div className={styles.divisor}/>

                <div className={styles.content}>

                    <div className={styles.footerMesa}>
                        <h3>Numéro do pedido: {data.numero}</h3>
                        {data.status == 'preparando' &&(
                            <button className={styles.btnCancelar}  onClick={()=> handleFecharMesa(data.id)}>
                                Cancelar
                            </button>
                        )}
                    </div>

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
                                    <td data-label="Preço">{formatCurrency(Number(item.price), "BRL")}</td>
                                    <td data-label="Total">{formatCurrency(Number(item.price * item.qtd), "BRL")}</td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                    
                    <div className={styles.footerMesa}>
                        <span>
                            <strong>Total do Pedido: {formatCurrency(Number(data.total), "BRL")}</strong>
                        </span>
                        {data.status == 'preparando' &&(
                            <button onClick={()=> handleFinalizarPedidio(data)}>Fechar mesa</button>
                        )}
                    </div>
                </div>

            </section>


        </article>
    )
}
