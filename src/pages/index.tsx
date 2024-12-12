import { HomeContainer, Product } from "@/styles/pages/home";
import Image from "next/image";
import logoImg from '@/assets/logo.svg'

export default function Home() {
  return (
    <HomeContainer>
      <Product >
        <Image src={logoImg.src} width={520} height={480} alt=""/>

        <footer>
          <strong>Camiseta X</strong>
          <span>R$ 79,90</span>
        </footer>
      </Product>
    </HomeContainer>
  );
}
