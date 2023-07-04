import Image from 'next/image';
import styles from './styles.module.scss';
import formatCurrency from '@/ultis/formatCurrecy';
import { useState, useContext } from 'react';
import { ProductsContext } from '@/contexts/Products'; 

import { IoMdAdd, IoMdRemove } from 'react-icons/io'
import { BsCartCheckFill} from 'react-icons/bs';
import { MdEdit} from 'react-icons/md';

import Link from 'next/link';
import { AuthContext } from '@/contexts/Auth';

type CardProductsProps = {
    nome:string,
    descricao:string,
    price:string,
    image:any,
    id:string,
    mesaId:string,
}

export function CardProduto(data:CardProductsProps){

    const { addCarinho }:any = useContext(ProductsContext);
    const { user }:any = useContext(AuthContext);
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

            {user.admin &&(
                <Link href={`/produtos/${data.id}`} className={styles.EditProduct}>
                    <MdEdit size={25} color='#1B6B93'/>
                </Link>
            )}

            <div className={styles.info}>
                <h3>{data.nome}</h3>
                    <span>{formatCurrency(Number(data.price), 'BRL')}</span>

                    <div className={styles.qtd}>
                        <div>

                            <button onClick={()=> setQtd(qtd + 1)}>
                                <IoMdAdd size={20} />
                            </button>

                            <span>{qtd}</span>

                            <button onClick={()=> diminuirQdt()}>
                                <IoMdRemove size={20} />
                            </button>

                        </div>

                        <button onClick={()=> addCarinhoComqtd(data, qtd) } ><BsCartCheckFill size={20} color='#000' /></button>
                    </div>
            </div>
        </article>
    )
}
