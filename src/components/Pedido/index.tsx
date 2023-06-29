import styles from './styles.module.scss';


interface PedidosProps {
    data:{
        id: string,
        cliente:string,
        numero: string,
        status: string,
        total: string,
        created:Date     
    },
}

export function Pedido({data}:PedidosProps){
    return (
        <article className={styles.container}>
            <button>
                <div className={styles.divisor}/>

                <div className={styles.content}>
                    Pedido: {data.numero}

                    <article>
                        
                    </article>
                </div>

            </button>
        </article>
    )
}
