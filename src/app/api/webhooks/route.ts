import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";
import { db } from "@/db";
import { NextResponse } from "next/server";
export async function POST(req: Request){
    try{
        const body = await req.text();
        const signature =  headers().get("stripe-signature");
        if(!signature){
            return new Response('Invalid signature',{
                status: 401
            })
        }
    const event = stripe.webhooks.constructEvent(body, signature,process.env.STRIPE_WEBHOOK_SECRET!)
    if(event.type === 'checkout.session.completed'){
        if(!event.data.object.customer_details?.email){
            throw new Error('Missing user email')
        }
        const session =  event.data.object as Stripe.Checkout.Session
        const {userID, orderId} = session.metadata || {
            userID: null,
            orderId: undefined,
        }

        if(!userID || !orderId){
            throw new Error('Invalid request metadata')
        }
        const billingAddress = session.customer_details!.address
        const shippingAddress = session.shipping_details!.address
        await db.order.update({
            where: {
                id: orderId ,
                userId: userID
            },
            data:{
                isPaid: true,
                shippingAddress: {
                    create: {
                        name: session.customer_details!.name!,
                        city: shippingAddress!.city!,
                        country: shippingAddress!.country!,
                        street: shippingAddress!.line1!,
                        
                        postalCode: shippingAddress!.postal_code!,
                        state: shippingAddress!.state!,
                        
                    }
                },
                billingAddress: {
                    create: {
                        name: session.customer_details!.name!,
                        city: shippingAddress!.city!,
                        country: shippingAddress!.country!,
                        street: shippingAddress!.line1!,
                        
                        postalCode: shippingAddress!.postal_code!,
                        state: shippingAddress!.state!,
                        
                    }
                }
            }

        })
    }
     
    return NextResponse.json({
        result: event,
        ok: true
    })
    }catch(e){
        console.error(e)
        // send to sentry 
        return NextResponse.json({
            message: 'Something went wrong',
            ok: false
        },{
            status: 500, // it wasn't processed 
                         // stripe will try it again  
        })
    }
}