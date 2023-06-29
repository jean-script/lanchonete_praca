import '@/styles/globals.scss';
import type { AppProps } from 'next/app'
import AuthProvider from '@/contexts/Auth';
import ProductsProvider from '@/contexts/Products'; 
import TableProvider from '@/contexts/Table';

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
      <ProductsProvider>
        <TableProvider>
          <Component {...pageProps} />
        </TableProvider>
      </ProductsProvider>
    </AuthProvider>
  </>
  )
}
