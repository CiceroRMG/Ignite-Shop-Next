import { stripe } from "@/lib/stripe";
import { ImageContainer, ProductContainer, ProductDetails } from "@/styles/pages/product";
import { GetStaticProps } from "next";
import Stripe from "stripe";

interface ProductProps {
    product: {
        id: string
        name: string
        imageUrl: string
        price: string
        description: string
    }
  }

export default function Product({product}: ProductProps) {
    return (
        <ProductContainer>
            <ImageContainer>

            </ImageContainer>

            <ProductDetails>
                <h1>{product.name}</h1>
                <span>{product.price}</span>

                <p>{product.description}</p>

                <button>
                    Comprar agora
                </button>
            </ProductDetails>
        </ProductContainer>
    )
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
        description: product.description
    }
  
    return {
      props: {
        product: productFiltred
      },
      revalidate: 60 * 60 * 1,
    }
  }