import { ChangeEvent, useEffect, useContext } from 'react'
import Head from "next/head";
import { Header } from '../../components/Header'
import { BsFillTrashFill } from 'react-icons/bs'

import styles from './styles.module.scss';
import { CategoriaCards } from '@/components/Categorias';
import { CardProduto } from '@/components/CardProduto';

import { ProductsContext } from '@/contexts/Products';
import { TableContext } from '@/contexts/Table'
import { Carinho } from '@/components/Carinho';
import { GetServerSideProps } from 'next';

export default function AbrirMesa(){

    const { getProducts, products, carinho }:any = useContext(ProductsContext);
    const { numberMesa, CloseTable,
            setNumberMesa, cliente, setCliente, 
            idMesa, OpenTable, mesaAberta, geraNum
        }:any = useContext(TableContext);

    useEffect(()=>{
        async function loadProdutos(){
            await getProducts('Todos')
        }
        loadProdutos()
        geraNum()
    }, [])

    async function handleAbrirMesa(e:ChangeEvent<HTMLInputElement>){
        e.preventDefault();
        OpenTable()
    }

    async function handleCloseTable(){
        CloseTable()
    }

    return (
        <>
            <Head>
                <title>Abrir mesa de pedido - Lanchonete da praça</title>
            </Head>

            <Header/>

            <main className={styles.main} onSubmit={handleAbrirMesa}>
                <div className={styles.container}>

                    {/* {mesaAberta &&( */}
                        <CategoriaCards
                            
                        />
                    {/* )} */}

                    {/* {!mesaAberta &&(
                        <>
                            <h1>Abrir novo Pedido</h1>
                            <form className={styles.forms}>

                                <input 
                                    type="number" 
                                    placeholder="Digite o numero da mesa"
                                    value={numberMesa}
                                    onChange={ (e)=> setNumberMesa(e.target.value)} 
                                />
                                <input 
                                    type="text" 
                                    placeholder="(Opcional) Digite o nome do cliente" 
                                    value={cliente}
                                    onChange={ (e)=> setCliente(e.target.value) }
                                />
                                
                                <button type="submit">Abrir</button>
                            </form>
                        </>
                    )} */}

                    {/* {mesaAberta &&( */}
                        <>
                            <div className={styles.formsContainer}>
                                <h1>Monte seu pedido {numberMesa} {cliente &&(
                                    <>
                                        cliente {cliente}
                                    </>
                                )}</h1>
                                {carinho.length <=0 &&(
                                    <button onClick={()=> handleCloseTable() }>
                                        <BsFillTrashFill size={25} color='#FF3F4B' />
                                    </button>
                                )}
                            </div>

                            <div className={styles.cardProducts}>

                                {products.map((item:any)=>(
                                    <CardProduto 
                                        key={item.id}
                                        nome={item.nome} 
                                        descricao={item.descricao} 
                                        image={item.avatarUrl}
                                        price={item.price}
                                        id={item.id}
                                        mesaId={idMesa}
                                        
                                    />
                                ))}
                            </div>


                            
                        </>
                    {/* )} */}

                </div>

                <Carinho
                    mesaAberta={mesaAberta}
                />
            </main>
        </>
    )
}
