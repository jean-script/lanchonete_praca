import { db } from '@/services/firebaseConnection';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { ReactNode, createContext, useState } from 'react';

type CardProductsProps = {
    nome:string,
    descricao:string,
    price:number,
    image:any,
    id:string,
    mesaId:string,
    qtd:number,
    idItem:string
}

interface ProductsProviderProps {
    children: ReactNode
}

export const ProductsContext = createContext({});

const listRef = collection(db, "Produtos");

function ProductsProvider({children}:ProductsProviderProps){
    const [products, setProducts] = useState([]);
    const [carinho, setCarinho]:any = useState([]);
    // quantidade de cada item
    const [qtd, setQtd] = useState(1);
    // state que controla o menu de carinho, aberto ou fechado
    const [openCard, setOpenCard] = useState(false);
    const [loading, setLoading]= useState(true);

   
    function addQtdProduct(){
        setQtd(qtd +1)
    }

    // remove o item clicado do carinho
    async function RemoveCarinho(id:string, idItem:string){
        const cart = carinho.filter((item:any)=> item.id !== id)
        setCarinho(cart);
    }

    async function RevCarinho(item:CardProductsProps){
        let id = item.id;

        const cart = carinho.filter((item:any)=> item.id == id)

        if (cart.length >=1) {
            const t = carinho.findIndex((i:any) => i.id === id);

            if(carinho[t].qtd <= 1){
                return;
            }
            carinho[t].qtd-=1;
            addQtdProduct();
            return;
        }
    }

    // adiciona um item ao carrinho e criar um item no banco de dados
    async function addCarinho(item:CardProductsProps,qtd:number){

        let id = item.id;
        console.log("item");
        const cart = carinho.filter((item:any)=> item.id == id)
        
        if (cart.length >=1) {
            const t = carinho.findIndex((i:any) => i.id === id);
            carinho[t].qtd+=1;
            console.log(carinho[t].idItem);
            addQtdProduct()
            return;
        }
        
        item = {
            ...item,
            qtd:qtd,
        }
        setCarinho([...carinho,item])    
    }
    
    // função que filtra os produtos da tela de abrir mesa 
    async function loadProdutos(busca:string){
        setLoading(true)
        if(busca === 'Todos'){
            const querySnapshot = await getDocs(listRef)
            .then((snapshot)=>{
                let lista:any = [];
    
                snapshot.forEach((doc)=>{
                    lista.push({
                        id: doc.id,
                        nome:doc.data().nome,
                        categoria: doc.data().categoria,
                        avatarUrl: doc.data().avatarUrl,
                        descricao: doc.data().descricao,
                        price: doc.data().price
                    })
                })
                setProducts(lista);
                setLoading(false)
                
            })
        } else {
            // se não tiver no parametro(busca) todos ele busca os produtos pelo id da categoria
            const q = query(listRef, orderBy('nome','asc'),where("categoriaid","==",busca))

            const querySnapshot = await getDocs(q);

            await updateState(querySnapshot)
        }
    }

    // função que atualiza os items da nossa variavel de produtos
    async function updateState(querySnapshot:any){

        const isCollectionEmpy = querySnapshot.size === 0;
        if(!isCollectionEmpy){
            let lista:any = [];
            querySnapshot.forEach((doc:any) => {
                lista.push({
                    id: doc.id,
                    nome:doc.data().nome,
                    categoria: doc.data().categoria,
                    avatarUrl: doc.data().avatarUrl,
                    descricao: doc.data().descricao,
                    price: doc.data().price
                })
            });
            
            setProducts(lista);
            setLoading(false)
        }
    }

    // função que chama a loadProducts e recebe a saida dela
    async function getProducts(query:any){
        await loadProdutos(query);
    }

    return (
        <ProductsContext.Provider
            value={{
                getProducts, 
                products,
                setProducts,
                addCarinho,
                carinho,
                setCarinho,
                RemoveCarinho,
                setOpenCard,
                openCard,
                addQtdProduct,
                RevCarinho,
                qtd,
                loading
            }}
        >
            {children}
        </ProductsContext.Provider>
    )

}

export default ProductsProvider;

