import { db } from '@/services/firebaseConnection';
import { collection,onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { createContext, useState } from 'react'
import { format } from 'date-fns';

export const PedidosContext = createContext({});

const listRef = collection(db, "Mesa");

function PedidosProvider({children}:any){

    const [pedidos, setPedidos] = useState([]);

    async function loadPedidos(status:string){
        const q = query(listRef, orderBy('created','desc'),where("status","==",status))

        const unsub = onSnapshot(q, (snapshot)=>{
            let lista:any = [];
            snapshot.forEach((doc:any) => {
                lista.push({
                    id: doc.id,
                    cliente:doc.data().cliente,
                    numero: doc.data().number,
                    status: doc.data().status,
                    total: doc.data().total,
                    created:doc.data().created,
                    createdFormat: format(doc.data().created.toDate(), "dd/MM/yyyy")
                })
            });

            setPedidos(lista);
        })
        
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