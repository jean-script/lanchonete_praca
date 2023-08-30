import { createContext, useState, useContext, ReactNode } from 'react'
import { db } from '@/services/firebaseConnection';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { ProductsContext } from '../Products';
import { PedidosContext } from '../Pedidos'
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { AuthContext } from '../Auth';

export const TableContext = createContext({});

const listRefItems = collection(db, "items");

interface PedidosProps {
    id: string;
    cliente:string;
    numero: string;
    status: string;
    total: number;
    created:Date ;
}

interface TableProviderProps {
    children: ReactNode
}

interface ItemsProps {
    id: string,
    nome: string,
    descricao: string,
    price: number,
    qtd: number,
    categoria: string
}


function TableProvider({children}:TableProviderProps){

    const { setOpenCard, carinho, setCarinho }:any = useContext(ProductsContext);
    const { pedidos, setPedidos }:any = useContext(PedidosContext);
    const { user }:any = useContext(AuthContext);

    const router = useRouter()
    const [numberMesa, setNumberMesa] = useState('');
    const [loading, setLoading] = useState(false)

    function geraNum(){
        setNumberMesa(String(Math.floor(Math.random() * 1000)))                
    }

    async function OpenTable() {
        setLoading(true)
        setNumberMesa(String(Math.floor(Math.random() * 1000)))

        if(carinho.length <=0) {
            toast.warn('Adicione items ao carinho para fechar o pedido!')
            return;
        }

        const totalPrice = carinho.reduce((acc:number, item:ItemsProps )=>{
            return (item.price * item.qtd ) + acc;
        }, 0);
        
        await addDoc(collection(db, 'Mesa'),{
            number: numberMesa,
            userId:user.uid,
            status: 'preparando',
            created: new Date(),
            updateAd: new Date(),
            total: totalPrice
        })
        .then((value)=>{
            carinho.map(async (item:ItemsProps)=>{
                await addDoc(listRefItems, {
                    mesaId: value.id,
                    produto: item.id,
                    produtoNome: item.nome,
                    produtoDesc: item.descricao,
                    price: item.price,
                    qtd:item.qtd,
                    category: item.categoria,
                })
            })
            setCarinho([]);
            setOpenCard(false)
            setLoading(false);
            router.push('/dashboard');
        })
        
    }
        

    async function CloseTable(){
        setNumberMesa('');
        setOpenCard(false)
        setCarinho([]);
        geraNum()
        router.push('/dashboard')
    } 


    async function PedidoFinalizado(data:PedidosProps){    

        console.log(pedidos);
        
        await updateDoc(doc(db, 'Mesa',data.id),{
            number: data.numero,
            userId:user.uid,
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
                CloseTable,
                PedidoFinalizado,
                geraNum,
                loading
            }}
        >
            {children}
        </TableContext.Provider>
    )
}

export default TableProvider;
