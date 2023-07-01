import { useEffect, useState, ChangeEvent } from 'react'
import Head from "next/head";
import { Header  } from '../../components/Header';
import { IoAdd } from 'react-icons/io5';

import styles from './styles.module.scss';
import { addDoc, collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db, storge } from '@/services/firebaseConnection';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { toast } from 'react-toastify';

const listRef = collection(db, "Categorias")


export default function Produtos(){

    const [categorias, setCategorias] = useState([]);
    const [categoriasSelect, setCategoriasSelect] = useState(0);
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');
    const [imageAvatar, setImageAvatar] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null);

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

    function hendleCustomerChange(e:any){
        setCategoriasSelect(e.target.value);
        console.log(categorias[e.target.value].categoria);
    }

    async function handleRegisterProduto(e:ChangeEvent<HTMLInputElement>){
        e.preventDefault();
        
        if (imageAvatar !== null && nome !== '' && descricao !== '') {
            await addDoc(collection(db,'Produtos'),{
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
                const currentUid = value.id;
                const uploadRef = ref(storge, `images/${currentUid}/${imageAvatar.name}`)
                const uploadTask = uploadBytes(uploadRef, imageAvatar)
                .then((snapshot)=>{
                    getDownloadURL(snapshot.ref).then(async (dowLoadURL)=>{
                        let urlFoto = dowLoadURL;

                        const docRef = doc(db, 'Produtos',currentUid)
                        await updateDoc(docRef, {
                            nome:nome,
                            descricao: descricao,
                            price:preco,
                            categoria: categorias[Number(categoriasSelect)].categoria,
                            categoriaid:categorias[Number(categoriasSelect)].id,
                            avatarUrl:urlFoto
                        })
                    })

                    toast.success('Novo Produto registrado')
                })
            })
        }
        
    }

    function handleFile(e){
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
                            {/* <Image 
                                src='https://blog.letskuk.com.br/wp-content/uploads/2022/10/lanches-gourmet.jpg' 
                                alt='hanburguer'
                                width={600}
                                height={600}
                                quality={100}
                            /> */}

                            { avatarUrl === null ?(
                                <></>
                            ) : (
                                <img src={avatarUrl} alt="foto de perfil" width={250} height={250} />
                            )}
                            
                            <IoAdd size={35} color="#000"/>
                            
                        </label>
                            
                        <select value={categoriasSelect} onChange={hendleCustomerChange}>
                            {categorias.map((value:any, index)=>(
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
