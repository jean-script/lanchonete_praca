import { useEffect, useState, ChangeEvent } from 'react'
import Head from "next/head";
import { Header  } from '../../components/Header';
import { IoAdd } from 'react-icons/io5';

import styles from './styles.module.scss';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db, storge } from '@/services/firebaseConnection';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { toast } from 'react-toastify';

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

const listRef = collection(db, "Categorias")

export default function Produtos({id, categ}:any){

    const [categorias, setCategorias]:any = useState(categ || []);
    const [categoriasSelect, setCategoriasSelect]:any = useState(0);
    const [nome, setNome]:any = useState('');
    const [descricao, setDescricao]:any = useState('');
    const [preco, setPreco]:any = useState('');
    const [imageAvatar, setImageAvatar]:any = useState(null);
    const [avatarUrl, setAvatarUrl]:any = useState(null);
    const route = useRouter()


    useEffect(()=>{

        async function loadProduto(){
            const docRef = doc(db, "Produtos", id);
            await getDoc(docRef)
            .then((snapshot)=> {
                setNome(snapshot.data()?.nome)
                setDescricao(snapshot.data()?.descricao)
                setPreco(snapshot.data()?.price);
                setAvatarUrl(snapshot.data()?.avatarUrl)
                
                let index = categorias.findIndex((item:any) => item.categoria === snapshot.data()?.categoria);
                setCategoriasSelect(index);        
            })
            
        }

        loadProduto();

        return ()=>{
            setNome('');
            setDescricao('');
            setPreco('');
        }

    },[])


    function hendleCustomerChange(e:any){
        setCategoriasSelect(e.target.value);
        console.log(categorias[e.target.value].categoria);
    }

    async function handleUpload(){
        const currendtUid = id;

        const uploadRef = ref(storge, `images/${currendtUid}/${imageAvatar.name}`)

        const uploadTask = uploadBytes(uploadRef, imageAvatar)
        .then((snapshot)=>{
            getDownloadURL(snapshot.ref).then(async (downLoadURL)=>{
                let urlFoto = downLoadURL;

                await updateDoc(doc(db,"Produtos", id),{
                    nome:nome,  
                    descricao: descricao,
                    price:preco,
                    categoria: categorias[Number(categoriasSelect)].categoria,
                    categoriaid:categorias[Number(categoriasSelect)].id,
                    avatarUrl: urlFoto
                })
                .then((value)=>{
                    setAvatarUrl(null);
                    setDescricao('');
                    setCategoriasSelect(0);
                    setNome('');
                    setPreco(0);

                    toast.success('Produto atualizado com sucesso!');
                    route.push('/abrirmesa');

                })
            })

        })
    }

    async function handleRegisterProduto(e:ChangeEvent<HTMLInputElement>){
        e.preventDefault();
        
        if (imageAvatar === null && nome !== '' && descricao !== '') {
            await updateDoc(doc(db,"Produtos", id),{
                nome:nome,  
                descricao: descricao,
                price:preco,
                categoria: categorias[Number(categoriasSelect)].categoria,
                categoriaid:categorias[Number(categoriasSelect)].id,
            })
            .then((value)=>{
                setAvatarUrl(null);
                setDescricao('');
                setCategoriasSelect(0);
                setNome('');
                setPreco(0);
                toast.success('Produto atualizado com sucesso!');
                route.push('/abrirmesa');
                
            })
            
        } else if(imageAvatar !== null && nome !== '' && descricao !== ''){
            handleUpload();
        }
        
    }

    function handleFile(e:any){
        if(e.target.files[0]){
            const image = e.target.files[0];

            if(image.type === 'image/jpeg' || image.type === 'image/png'){
                setImageAvatar(image);
                setAvatarUrl(URL.createObjectURL(image))
            }else {
                setImageAvatar(null);
                return;
            }

        }
    }

    return(
        <>
            <Head>
                <title>Cadastrar Produto - Lanchonete da praça</title>
            </Head>

            <Header/>

            <main className={styles.main}>
                <div className={styles.container} onSubmit={handleRegisterProduto}>       
                    <h1>Novo Produto</h1>
                    
                    <form className={styles.forms}>

                        <label className={styles.mack}>
                            <input type="file" accept="image/*" onChange={handleFile}/>
                            
                            { avatarUrl === null ?(
                                <></>
                            ) : (
                                <img src={avatarUrl} alt="foto de perfil" width={250} height={250} />
                            )}
                            
                            <IoAdd size={35} color="#000"/>
                            
                        </label>
                            
                        <select value={categoriasSelect} onChange={hendleCustomerChange}>
                            {categorias.map((value:any, index:any)=>(
                                <option key={index} value={index}>{value.categoria}</option>
                            ))}
                        </select>

                        <input type="text" placeholder="Digite o nome do produto" 
                            value={nome} onChange={(e)=> setNome(e.target.value)}
                        />
                        <input type="number" placeholder="Digite o preço" 
                            value={preco} onChange={(e)=> setPreco(e.target.value)}
                        />
                        <textarea placeholder="Digite a descrição do produto"
                            value={descricao} onChange={(e)=> setDescricao(e.target.value)}
                        ></textarea>
                        
                        <button type="submit">Cadastrar</button>
                    </form>

                </div>
            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {

    const id = params?.id as string;

    let categorias;

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

        categorias = lista;
        
    })
    .catch((e)=>{
        console.log(e);
        
    })
    
    return {
        props:{
           id: id,
           categ: categorias
        }
    }
}
