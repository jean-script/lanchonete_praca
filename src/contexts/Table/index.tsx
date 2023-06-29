import { createContext, useState, useContext } from 'react'
import { db } from '@/services/firebaseConnection';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ProductsContext } from '../Products';
import { useRouter } from 'next/router';

export const TableContext = createContext({});

function TableProvider({children}:any){

    const { setOpenCard, carinho, setCarinho }:any = useContext(ProductsContext);
    const router = useRouter()

    const [mesaAberta, setMesaAberta] = useState(false);
    const [numberMesa, setNumberMesa] = useState('');
    const [cliente, setCliente] = useState('');
    const [idMesa, setIdMesa] = useState('');

    async function OpenTable() {

        if (numberMesa === '') {
            return;
        }

        await addDoc(collection(db, 'Mesa'),{
            number: numberMesa,
            cliente: cliente,
            status: 'rascunho',
            created: new Date(),
            updateAd: new Date()
        })
        .then((value)=>{
            setIdMesa(value.id)
            setMesaAberta(true);
        })
    }

    async function CloseTable(){
        await deleteDoc(doc(db, 'Mesa',idMesa))
        setCliente('');
        setMesaAberta(false);
        setNumberMesa('');
        setOpenCard(false)
        setCarinho([]);
        
    } 

    async function MudaStatusMesa(){

        if (carinho.length <= 0) {
            return;
        }

        const totalPrice = carinho.reduce((acc:number, item:any )=>{
            return (item.price * item.qtd ) + acc;
        }, 0);

        await updateDoc(doc(db, 'Mesa',idMesa),{
            number: numberMesa,
            cliente: cliente,
            status: 'preparando',
            total:totalPrice,
            updateAd: new Date()
        }).then(()=>{
            setCliente('');
            setMesaAberta(false);
            setNumberMesa('');
            setOpenCard(false)
            setCarinho([]);
            router.push('/dashboard')

        })
    }

    return(
        <TableContext.Provider
            value={{
                OpenTable,
                numberMesa, 
                setNumberMesa,
                cliente, 
                setCliente,
                idMesa,
                mesaAberta,
                CloseTable,
                MudaStatusMesa
            }}
        >
            {children}
        </TableContext.Provider>
    )
}

export default TableProvider;
