import { useState, useContext, ReactElement, cloneElement} from 'react'

import Link, { LinkProps } from "next/link";
import { TableContext } from '@/contexts/Table';

import styles from './styles.module.scss';
import { useRouter } from 'next/router';

interface ActiveLinkProps extends LinkProps{
    children:ReactElement;
    activeClassName: string;
}

export function ActiveLink({children, activeClassName ,...rest}:ActiveLinkProps){
    
    const { geraNum }:any = useContext(TableContext);
    const [categoriaSelected, setCategoriaSelected] = useState('Home')
    const { asPath } = useRouter();
    
    function handleChangeColorMenuItem(tag:any) {
        setCategoriaSelected(tag)
    }

    function handleChangeCorAndGeraNum(tag:any){
        setCategoriaSelected(tag);
        geraNum();
    }

    const className = asPath === rest.href ? activeClassName : '';

    return(
        <Link {...rest} 
        >
            {cloneElement(children, {
                className
            })}
        </Link>
    );
}
