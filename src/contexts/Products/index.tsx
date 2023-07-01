import { db } from '@/services/firebaseConnection';
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { createContext, useState } from 'react';
import { toast } from 'react-toastify';


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

export const ProductsContext = createContext({});

const listRefItems = collection(db, "items");
const listRef = collection(db, "Produtos");

function ProductsProvider({children}:any){
    const [products, setProducts] = useState([]);
    const [carinho, setCarinho]:any= useState([]);
    // quantidade de cada item
    const [qtd, setQtd] = useState(1);
    // state que controla o menu de carinho, aberto ou fechado
    const [openCard, setOpenCard] = useState(false);

   
    function addQtdProduct(){
        setQtd(qtd +1)
    }

    // remove o item clicado do carinho
    async function RemoveCarinho(id:string, idItem:string){
        await deleteDoc(doc(db, 'items',idItem)).then(()=> toast.warn('Item remolvido'));
        const cart = carinho.filter((item:any)=> item.id !== id)
        setCarinho(cart);
    }

    async function RevCarinho(item:CardProductsProps,qtd:number){
        let id = item.id;

        const cart = carinho.filter((item:any)=> item.id == id)

        if (cart.length >=1) {
            const t = carinho.findIndex((i:any) => i.id === id);

            if(carinho[t].qtd <= 1){
                return;
            }

            await updateDoc(doc(db, 'items',item.idItem),{
                mesaId: item.mesaId,
                produto: item.id,
                produtoNome: item.nome,
                produtoDesc: item.descricao,
                price: item.price,
                qtd: qtd - 1 
            });

            carinho[t].qtd-=1;
            addQtdProduct()

            
            return;
        }
    }

    async function addQuantCarinho(item:CardProductsProps,qtd:number) {
        let id = item.id;
        console.log("item");
        
        console.log(item);
        const cart = carinho.filter((item:any)=> item.id == id)
        console.log("cart");
        console.log(cart);
        
        if (cart.length >=1) {
            const t = carinho.findIndex((i:any) => i.id === id);
            carinho[t].qtd+=1;
            console.log(carinho[t].idItem);
            console.log(item.idItem);
        
            addQtdProduct()
            
            await updateDoc(doc(db, "items",carinho[t].idItem),{
                mesaId: item.mesaId,
                produto: item.id,
                produtoNome: item.nome,
                produtoDesc: item.descricao,
                price: item.price,
                qtd:( qtd + 1),
                idItem:item.idItem
            })

            return;
        }
    }

    // adiciona um item ao carrinho e criar um item no banco de dados
    async function addCarinho(item:CardProductsProps,qtd:number){

        let id = item.id;
        console.log("item");
        
        console.log(item);
        const cart = carinho.filter((item:any)=> item.id == id)
        console.log("cart");
        console.log(cart);
        
        if (cart.length >=1) {
            // const t = carinho.findIndex((i:any) => i.id === id);
            // carinho[t].qtd+=1;

            // console.log(carinho[t].idItem);
            // // console.log(item.idItem);
        
            // addQtdProduct()
            
            // await updateDoc(doc(db, "items", ),{
            //     mesaId: item.mesaId,
            //     produto: item.id,
            //     produtoNome: item.nome,
            //     produtoDesc: item.descricao,
            //     price: item.price,
            //     qtd:( qtd + 1),
            //     idItem:item.idItem
            // })
            return;
        }
        
        await addDoc(listRefItems, {
            mesaId: item.mesaId,
            produto: item.id,
            produtoNome: item.nome,
            produtoDesc: item.descricao,
            price: item.price,
            qtd:qtd
        })
        .then((value)=>{
            item = {
                ...item,
                qtd:qtd,
                idItem:value.id
            }
            setCarinho([...carinho,item])    
            toast.success("Item adicionado ao carinho!")        
        })
    }
    
    // função que filtra os produtos da tela de abrir mesa 
    async function loadProdutos(busca:string){

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
                addQuantCarinho,
                RevCarinho,
                qtd
            }}
        >
            {children}
        </ProductsContext.Provider>
    )

}

export default ProductsProvider;
