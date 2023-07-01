import { createContext, useState, useContext } from 'react'
import { db } from '@/services/firebaseConnection';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ProductsContext } from '../Products';
import { PedidosContext } from '../Pedidos'
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export const TableContext = createContext({});

interface PedidosProps {
    
    id: string,
    cliente:string,
    numero: string,
    status: string,
    total: number,
    created:Date ,  
    
}

function TableProvider({children}:any){

    
    const { setOpenCard, carinho, setCarinho }:any = useContext(ProductsContext);
    const { pedidos, setPedidos }:any = useContext(PedidosContext);

    const router = useRouter()

    const [mesaAberta, setMesaAberta] = useState(false);
    const [numberMesa, setNumberMesa] = useState('');
    const [cliente, setCliente] = useState('');
    const [idMesa, setIdMesa] = useState('');

    function geraNum(){
        return new Promise((resolve, reject)=>{
            resolve(setNumberMesa(String(Math.floor(Math.random() * 100))))
        })
    }

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
        await deleteDoc(doc(db, 'Mesa',idMesa)).then(()=> toast.info('Pedido cancelado'))
        setCliente('');
        setMesaAberta(false);
        setNumberMesa('');
        setOpenCard(false)
        setCarinho([]);
        geraNum()
        
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
            toast.info('Pedido em preparo')
            router.push('/dashboard')

        })
    }

    async function PedidoFinalizado(data:PedidosProps){    

        console.log(pedidos);
        
        await updateDoc(doc(db, 'Mesa',data.id),{
            number: data.numero,
            cliente: data.cliente,
            status: 'finalizado',
            total:data.total,
            updateAd: new Date()
        }).then(()=>{
            const peds = pedidos.filter((item:any)=> item.id !== data.id)
            setPedidos(peds)
            toast.info('Pedido Finalizado');
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
                MudaStatusMesa,
                PedidoFinalizado,
                geraNum
            }}
        >
            {children}
        </TableContext.Provider>
    )
}

export default TableProvider;
