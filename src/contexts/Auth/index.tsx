import { createContext, useEffect, useState } from 'react';
import { Redirect } from 'next';
import { auth, db } from '@/services/firebaseConnection';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';

type PropsCreateUser = {
    nome:string,
    email:string,
    password:string
}


export const AuthContext = createContext({});

function AuthProvider({ children }:any){

    const [user, setUSer]:any = useState({});
    const router = useRouter()

    useEffect(()=>{
        const userStorge = localStorage.getItem('@lanchonetePro')

        if(userStorge){
            setUSer(JSON.parse(userStorge))
            router.push('/dashboard')
        } else {
            router.push('/')
        }
    },[])

    async function Login(email:string, password:string) {
        await signInWithEmailAndPassword(auth, email,password)
        .then(async(value)=>{
            let uid = value.user.uid;

            const docRef = doc(db, "Users", uid);
            const docSnap:any = await getDoc(docRef)

            let data = {
                uid:uid,
                nome:docSnap.data().nome,
                email:value.user.email,
                avatarUrl:docSnap.data().avatarUrl
            }

            storgeUser(data);
            setUSer(data);
            router.push('/dashboard')
        })
    }

    async function CreateUser(nome:string, email:string, password: string){
        await createUserWithEmailAndPassword(auth, email, password)
        .then( async (value)=>{
            let uid = value.user.uid;

            await setDoc(doc(db, "Users", uid),{
                nome:nome,
                avatarUrl:null
            })
            .then(()=>{
                let data ={
                    uid:uid,
                    nome:nome,
                    email:value.user.email,
                    avatarUrl:null
                };

                setUSer(data);
                storgeUser(data);

            })
        })
        .catch((e)=>{
            console.log(e);
            console.log('Erro ao cadastrar');
        })
    }

    async function Logout() {
        await signOut(auth)
        localStorage.removeItem('@lanchonetePro');
        setUSer(null);
        router.push('/')
    }

    function storgeUser(data:object){
        localStorage.setItem('@lanchonetePro', JSON.stringify(data));
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                CreateUser,
                Login,
                Logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )

}

export default AuthProvider;
