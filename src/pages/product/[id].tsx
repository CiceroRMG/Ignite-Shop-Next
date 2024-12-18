import { stripe } from "@/lib/stripe";
import { ImageContainer, ProductContainer, ProductDetails } from "@/styles/pages/product";
import axios from "axios";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import Stripe from "stripe";

interface ProductProps {
    product: {
        id: string
        name: string
        imageUrl: string
        price: string
        description: string
        priceId: string
    }
  }

export default function Product({product}: ProductProps) {
    const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false)

    async function handleBuyProduct() {
        try {
            setIsCreatingCheckoutSession(true)

            const response = await axios.post('/api/checkout', {
                priceId: product.priceId
            })
    
            const { checkoutUrl } = response.data
    
            window.location.href = checkoutUrl
        } catch (err) {
            setIsCreatingCheckoutSession(false)
            console.log(err);
            alert('Falha ao redirecionar ao checkout!')
        }
    }

    return (
        <>
            <Head>
                <title>Product | Ignite Shop</title>
            </Head>

            <ProductContainer >
                <ImageContainer>
                    <Image src={product.imageUrl} width={520} height={480} alt="" />
                </ImageContainer>

                <ProductDetails>
                    <h1>{product.name}</h1>
                    <span>{product.price}</span>

                    <p>{product.description}</p>

                    <button onClick={handleBuyProduct} disabled={isCreatingCheckoutSession}>
                        Comprar agora
                    </button>
                </ProductDetails>
            </ProductContainer>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async ( ) => {
    return {
        paths: [
            {
                params: { id: 'prod_ROM8RfbnT8mazQ' }
            }
        ],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps<any, {id: string}> = async ({ params }) => {
    const productId = params ? params.id : "null"
    const product = await stripe.products.retrieve(productId, {
      expand: ['default_price']
    })
  
    const price = product.default_price as Stripe.Price

    const productFiltred = {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price:  new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(price.unit_amount ? (price.unit_amount / 100) : 0),
        description: product.description,
        priceId: price.id
    }
  
    return {
      props: {
        product: productFiltred
      },
      revalidate: 60 * 60 * 1,
    }
  }