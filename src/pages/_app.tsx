import { globalStyles } from '@/styles/global';
import { AppProps } from 'next/app';
import { Container, Header } from '@/styles/pages/app';
import logoImg from '@/assets/logo.svg'
import Image from 'next/image';

globalStyles()

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Container>
            <Header>
                <Image src={logoImg.src} alt="" width={logoImg.width} height={logoImg.width} priority/>
            </Header>

            <Component {...pageProps} />  
        </Container>
    ) 
}

export default MyApp