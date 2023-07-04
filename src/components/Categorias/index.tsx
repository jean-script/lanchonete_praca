import { useEffect, useState, useContext } from 'react'
import styles from './styles.module.scss'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebaseConnection';

import { ProductsContext } from '@/contexts/Products'

const listRef = collection(db, "Categorias");

export function CategoriaCards(){

    const [categorias, setCategorias] = useState([]);
    const [categoriaSelected, setCategoriaSelected] = useState('Todos')
    const [ Products, setProducts] = useState([]);
    const { getProducts }:any = useContext(ProductsContext);


    useEffect(()=>{
        async function LoadCategorias(){
            const querySnapshot = await getDocs(listRef)
            .then((snapshot)=>{
                let lista:any = [];

                snapshot.forEach((doc)=>{
                    lista.push({
                        id:doc.id,
                        categoria:doc.data().categoria
                    })
                })
                if(snapshot.size === 0){
                    return;
                }

                setCategorias(lista);                
            })
            .catch((e)=>{
                console.log(e);
                
            })
        }

        LoadCategorias();
    },[])

    async function handleFilter(id:any, categoria:string){
        setCategoriaSelected(categoria);
        let data = await getProducts(id)
        setProducts(data);
    }


    return (
        <section className={styles.container}>
            <div>
                <button onClick={()=> handleFilter('Todos', 'Todos')} className={'Todos' === categoriaSelected ? styles.activeBtn : ''}>Todos</button>

                {categorias.map((item:any)=>(
                    <button key={item.id} className={item.categoria === categoriaSelected ? styles.activeBtn : ''} onClick={()=> handleFilter(item.id, item.categoria)}><span>{item.categoria}</span></button>
                ))}
               
            </div>

        </section>
    )
}
