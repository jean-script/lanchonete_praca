import { ChangeEvent, useContext, useState } from 'react';
import HeaderVertical from "@/components/HeaderVertical";
import { AuthContext } from "@/contexts/Auth";
import Head from "next/head";

import styles from './styles.module.scss';
import Image from 'next/image';

import AvatarImage from '@/assets/avatar.png'; 
import { IoAdd } from 'react-icons/io5';
import { db, storge } from '@/services/firebaseConnection';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

export default function Profile(){
    const { user, Logout, UpdateUser, storgeUser }:any = useContext(AuthContext);
    const [nome,setNome] = useState(user?.nome || '');
    const [email, setEmail] = useState(user?.email || '');
    const [imageAvatar, setImageAvatar]:any = useState(null);
    const [avatarUrl, setAvatarUrl]:any = useState(user?.avatarUrl || null);

    console.log(user);
    

    async function handleUpdateProfile(e:ChangeEvent<HTMLInputElement>){
        e.preventDefault();

        if(imageAvatar !== null && nome !== '' && email !== ''){

            const userId = user.uid;

            const uploadRef = ref(storge, `images/${userId}/${imageAvatar.name}`);

            const uploadTask = uploadBytes(uploadRef, imageAvatar)
                .then((snapshot)=> {
                    getDownloadURL(snapshot.ref).then(async (downLoadURL)=> {
                        let FotoUrl = downLoadURL;  
    
                        await updateDoc(doc(db,"Users", userId), {
                            nome: nome,
                            avatarUrl: FotoUrl,
                        })
                        .then(()=> {
                            let data = {
                                uid:user.uid,
                                nome:user.nome,
                                email:user.email,
                                avatarUrl:FotoUrl,
                                admin: user.admin,
                            }
                            
                            storgeUser(data);
                            toast.success('Dados atualizados com sucesso!');
                        });
    
                    })
                })

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
                <title>Profile - {user?.nome}</title>
            </Head>

        

            <main className={styles.main} onSubmit={handleUpdateProfile}>
                <section className={styles.container}>
                    <label >
                        <input type="file" accept="image/*" onChange={handleFile} />
                        { avatarUrl === null ?(
                                <></>
                            ) : (
                            <img src={avatarUrl} alt="foto de perfil" width={250} height={250} />
                        )}
                        <IoAdd size={35} color="#fff"/>
                    </label>

                    <form className={styles.forms} >
                        <input 
                            type='text' 
                            placeholder='Digite o nome' 
                            value={nome} 
                            onChange={(e)=> setNome(e.target.value)}
                        />

                        <input 
                            type='email' 
                            placeholder='Digite o email' 
                            value={email} 
                            onChange={(e)=> setEmail(e.target.value)}
                            disabled={true}
                        />
                                
                        <button type='submit'>Atualizar </button>

                    </form>

                    <button className={styles.buttonLogout} onClick={()=> Logout()}>
                        Sair
                    </button>
                </section>
            </main>
        </>

    );
}
