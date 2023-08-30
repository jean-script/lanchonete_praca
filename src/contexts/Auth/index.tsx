import { ReactNode, createContext, useEffect, useState } from 'react';
import { auth, db, storge } from '@/services/firebaseConnection';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';


interface AuthProviderProps {
    children: ReactNode
}

export const AuthContext = createContext({});

function AuthProvider({ children }:AuthProviderProps){

    const [user, setUSer]:any = useState({});
    const [load, setLoad] = useState(false);
    const router = useRouter()

    useEffect(()=>{
        setLoad(true);
        const userStorge = localStorage.getItem('@lanchonetePro')

        if(userStorge){
            setUSer(JSON.parse(userStorge))
            setLoad(false);
            router.push('/dashboard')
        } 
        else {
            setLoad(false);
            router.push('/')
        }
        setLoad(false);
    },[])

    async function Login(email:string, password:string) {
        setLoad(true);
        await signInWithEmailAndPassword(auth, email,password)
        .then(async(value)=>{
            let uid = value.user.uid;

            const docRef = doc(db, "Users", uid);
            const docSnap:any = await getDoc(docRef)

            let data = {
                uid:uid,
                nome:docSnap.data().nome,
                email:value.user.email,
                avatarUrl:docSnap.data().avatarUrl,
                admin: docSnap.data()?.admin,
            }

            storgeUser(data);
            setUSer(data);
            setLoad(false);
            toast.success("Bem-vindo de volta")
            router.push('/dashboard')
        })
        .catch((e)=>{
            setLoad(false);
            toast.error("Erro ao fazer login")
            console.log(e);
        })
    }

    async function UpdateUser(userId: string, nome: string, nomeImage: any ) {
       
        const uploadRef = ref(storge, `images/${userId}/${nomeImage}`);
        const uploadTask = uploadBytes(uploadRef, nomeImage)
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

    async function CreateUser(nome:string, email:string, password: string){
        await createUserWithEmailAndPassword(auth, email, password)
        .then( async (value)=>{

            let uid = value.user.uid;

            await setDoc(doc(db, "Users", uid),{
                nome:nome,
                avatarUrl:null,
                admin: false
            })
            .then(()=>{
                let data ={
                    uid:uid,
                    nome:nome,
                    email:value.user.email,
                    avatarUrl:null,
                    admin: false,
                };

                setUSer(data);
                storgeUser(data);
                toast.success('Usuário criado com sucesso!')

            })
        })
        .catch((e)=>{
            console.log(e);
            console.log('Erro ao cadastrar');
            toast.error('Error ao cadastrar');
        })    
    }

    async function Logout() {
        await signOut(auth)
        localStorage.removeItem('@lanchonetePro');
        setUSer(null);
        router.push('/')
        toast.info('Volte sempre');
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
                Logout,
                load,
                UpdateUser,
                storgeUser
            }}
        >
            {children}
        </AuthContext.Provider>
    )

}

export default AuthProvider;
