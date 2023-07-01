import '@/styles/globals.scss';
import type { AppProps } from 'next/app'
import AuthProvider from '@/contexts/Auth';
import ProductsProvider from '@/contexts/Products'; 
import TableProvider from '@/contexts/Table';
import PedidosProvider from '@/contexts/Pedidos';

import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

/* AuthProvider para autenticação e usuario  */

/* 
  ProductsProvider para criação de produtos e 
  manipulação do carinho de compras  

*/

/* TableProvider para criação da mesa e fechamento  */

export default function App({ Component, pageProps }: AppProps) {
  return (
  <>
    
    <AuthProvider>
      <ToastContainer  autoClose={3000} limit={3}/>
      <ProductsProvider>
        <PedidosProvider>
          <TableProvider>
            <Component {...pageProps} />
          </TableProvider>
        </PedidosProvider>
      </ProductsProvider>
    </AuthProvider>
  </>
  )
}
