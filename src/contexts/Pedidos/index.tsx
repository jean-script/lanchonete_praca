import { createContext, useState,useContext } from 'react'
import { collection,onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/services/firebaseConnection';
import { format } from 'date-fns';
import { AuthContext } from '../Auth';

export const PedidosContext = createContext({});

const listRef = collection(db, "Mesa");

function PedidosProvider({children}:any){

    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user }:any = useContext(AuthContext);

    async function loadPedidos(status:string){
        try {
            setLoading(true)
            let q;
            if(user?.admin){
                q = query(listRef, orderBy('created','desc'),where("status","==",status))
            } else {
                q = query(listRef, orderBy('created','desc'),where("status","==",status), where("userId","==",user.uid))
            }
            
            const unsub = onSnapshot(q, (snapshot:any)=>{
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
                setLoading(false)
            })
        } catch (e) {
            console.log(e);
        }
        
        
    }

    return (
        <PedidosContext.Provider
            value={{
                pedidos,
                setPedidos,
                loadPedidos,
                loading
            }}
        >
            {children}
        </PedidosContext.Provider>
    )

}

export default PedidosProvider;