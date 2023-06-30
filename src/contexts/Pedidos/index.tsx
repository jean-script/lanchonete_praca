import { db } from '@/services/firebaseConnection';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { createContext, useState, useEffect } from 'react'

export const PedidosContext = createContext({});

const listRef = collection(db, "Mesa");

function PedidosProvider({children}:any){

    const [pedidos, setPedidos] = useState([]);

    async function loadPedidos(){
        const q = query(listRef, orderBy('created','desc'),where("status","==","preparando"))

        const querySnapshot = await getDocs(q);

        await updateState(querySnapshot);
    }


    async function updateState(querySnapshot:any){

        const isCollectionEmpy = querySnapshot.size === 0;
        if(!isCollectionEmpy){
            let lista:any = [];
            querySnapshot.forEach((doc:any) => {
                lista.push({
                    id: doc.id,
                    cliente:doc.data().cliente,
                    numero: doc.data().number,
                    status: doc.data().status,
                    total: doc.data().total,
                    created:doc.data().created,
                })
            });
            
            setPedidos(lista);
        }
    }

    return (
        <PedidosContext.Provider
            value={{
                pedidos,
                setPedidos,
                loadPedidos
            }}
        >
            {children}
        </PedidosContext.Provider>
    )

}

export default PedidosProvider;