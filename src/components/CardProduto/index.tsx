import Image from 'next/image';
import styles from './styles.module.scss';
import formatCurrency from '@/ultis/formatCurrecy';
import { useState, useContext } from 'react';
import { ProductsContext } from '@/contexts/Products'; 
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/services/firebaseConnection';

type CardProductsProps = {
   
    nome:string,
    descricao:string,
    price:string,
    image:any,
    id:string,
    mesaId:string

}

const listRefItems = collection(db, "items");

export function CardProduto(data:CardProductsProps){

    const { addCarinho }:any = useContext(ProductsContext);
    const [qtd, setQtd] = useState(1);

    async function addCarinhoComqtd(data:any, qtd:number){
        
        addCarinho(data, qtd);
        setQtd(1)
    }

    function diminuirQdt(){

        if(qtd <= 1){
            return;
        }
        setQtd(qtd - 1)
    }

    return(
        <article className={styles.cardProduct}>
            <Image src={data.image} alt='foto do lanche' width={200} height={200}/>
            <p>{data.descricao}</p>

            <div className={styles.info}>
                <h3>{data.nome}</h3>
                <div>
                    <span>{formatCurrency(Number(data.price), 'BRL')}</span>
                    <div className={styles.qtd}>
                        <button onClick={()=> setQtd(qtd + 1)}>+</button>
                        {qtd}
                        <button onClick={()=> diminuirQdt()}>-</button>
                    </div>
                </div>
                <button className={styles.btnAdd} onClick={()=> addCarinhoComqtd(data, qtd) } >Adicionar</button>
            </div>
        </article>
    )
}
