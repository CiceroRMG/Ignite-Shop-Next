import { stripe } from "@/lib/stripe";
import { NextApiRequest, NextApiResponse } from "next";

interface bodyType {
    priceId: string 
}

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    const { priceId }: bodyType = req.body

    if (req.method !== 'POST') {
        return res.status(405)
    }

    if (!priceId) {
        return res.status(400).json({
            error: 'Price Not Found'
        })
    }

    const successUrl = `${process.env.NEXT_URL}/success`
    const cancelUrl = `${process.env.NEXT_URL}/`

    const checkoutSession = await stripe.checkout.sessions.create({
        success_url: successUrl,
        cancel_url: cancelUrl,
        mode: 'payment',
        line_items: [
            {
                price: priceId,
                quantity: 1
            }
        ]
    })

    res.status(201).json({
        checkoutUrl: checkoutSession.url
    })
}