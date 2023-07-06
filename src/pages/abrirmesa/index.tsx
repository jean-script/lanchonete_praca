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
import { AuthContext } from '@/contexts/Auth';

export default function AbrirMesa(){

    const { user }:any = useContext(AuthContext);
    const { getProducts, products, carinho, setProducts }:any = useContext(ProductsContext);
    const { CloseTable, 
            idMesa, OpenTable, loading
        }:any = useContext(TableContext);

    useEffect(()=>{
        async function loadProdutos(){
            await getProducts('Todos')
        }
        loadProdutos()

        return ()=> {
            setProducts([]);
        }
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

                        <CategoriaCards
                            
                        />

                        <>
                            <div className={styles.formsContainer}>
                                <h1>Monte seu pedido {user.nome &&(
                                    <>
                                        {user.nome}
                                    </>
                                )}</h1>
                                {carinho.length <=0 &&(
                                    <button onClick={()=> handleCloseTable() }>
                                        <BsFillTrashFill size={25} color='#FF3F4B' />
                                    </button>
                                )}
                            </div>

                            <div className={styles.cardProducts}>
                                {loading && (
                                    <>
                                        Carregando...
                                    </>
                                )}
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

                </div>
                <Carinho/>
            </main>
        </>
    )
}
