import { useContext } from 'react'
import Image from 'next/image'
import styles from './styles.module.scss';
import { BsFillCartFill, BsTrashFill } from 'react-icons/bs';

import { ProductsContext } from '@/contexts/Products';
import formatCurrency from '@/ultis/formatCurrecy';
import { TableContext } from '@/contexts/Table';
import { IoMdAdd, IoMdRemove } from 'react-icons/io';

export function Carinho({mesaAberta}:any){

    const { carinho, RemoveCarinho, setOpenCard, openCard, addQuantCarinho, RevCarinho }:any = useContext(ProductsContext);
    const { OpenTable, loading }:any = useContext(TableContext)
    // calcula o total dos valore do itens do carinho   
    const totalPrice = carinho.reduce((acc:number, item:any )=>{
        return (item.price * item.qtd ) + acc;
    }, 0);

    return(
        <>  
            <div className={styles.carinhoContainer}>
                <div>
                    <button onClick={()=> setOpenCard(!openCard)} className={styles.btnCarinho} >
                        {carinho.length >=1 &&(
                            <span>{carinho.length}</span>
                        )}
                        <BsFillCartFill size={25} color='#000' />
                    </button>
                </div>
            </div>
            {openCard &&(
                <div className={styles.div}>
                    <section className={openCard ? styles.container : styles.activeContainer }>
                        {carinho.map((item:any)=>(
                            <>
                                <div key={item.id} className={openCard ? styles.carinho : styles.activeCarinho}>
                                    <Image 
                                        src={item.image} 
                                        alt={item.nome}
                                        width={100}
                                        height={100}
                                    />
                                    <div>
                                        <span>{item.nome}</span>
                                        <span>{formatCurrency(item.price, "BRL")}</span>
                                        <article className={styles.containerQuant}>
                                            <button className={styles.btnqtd} onClick={()=> addQuantCarinho(item, Number(item.qtd))}><IoMdAdd size={20} color='#000'/></button>
                                            <span>{item.qtd}</span>
                                            <button className={styles.btnqtd} onClick={()=> RevCarinho(item, Number(item.qtd)) }><IoMdRemove size={20} color='#000' /></button>
                                        </article>
                                    </div>

                                    <button className={styles.thash} onClick={()=> RemoveCarinho(item.id, item.idItem)}>
                                        <BsTrashFill size={25} color='red' />
                                    </button>

                                </div>
                            </>
                            
                        ))}
                        <span className={styles.totalPrice}>{formatCurrency(totalPrice, 'BRL')}</span>
                        <button onClick={()=> OpenTable()} className={styles.btnFecharPedido}> {loading ? 'Enviando pedido...': 'Fechar pedido'} </button>
                    </section>
                    
                </div>
            )}
        </>
    )
}
