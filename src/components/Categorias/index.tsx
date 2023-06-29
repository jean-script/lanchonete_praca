import { useEffect, useState, useContext } from 'react'
import styles from './styles.module.scss'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebaseConnection';

import { ProductsContext } from '@/contexts/Products'

const listRef = collection(db, "Categorias");
const listRefProducts = collection(db, "Produtos");

export function CategoriaCards(){

    const [categorias, setCategorias] = useState([]);
    const [Products, setProducts] = useState([]);
    const { getProducts } = useContext(ProductsContext);

    useEffect(()=>{
        async function LoadCategorias(){
            const querySnapshot = await getDocs(listRef)
            .then((snapshot)=>{
                let lista = [];

                snapshot.forEach((doc)=>{
                    lista.push({
                        id:doc.id,
                        categoria:doc.data().categoria
                    })
                })
                if(snapshot.size === 0){
                    // setCategorias([{id:"1":, categoria:"Freela"}])
                    return;
                }

                setCategorias(lista);
                console.log(lista);
                
                
            })
            .catch((e)=>{
                console.log(e);
                
            })


        }

        LoadCategorias();
    },[])

    async function handleFilter(id:any){
        let data = await getProducts(id)
        setProducts(data);
    }

    return (
        <section className={styles.container}>
            <div>
                <button onClick={()=> handleFilter('Todos')}>Todos</button>
                {categorias.map((item)=>(
                    <button key={item.id} onClick={()=> handleFilter(item.id)}>{item.categoria}</button>
                ))}
               
            </div>

        </section>
    )
}
