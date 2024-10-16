import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";
import { db } from "@/db";
import { NextResponse } from "next/server";
import {Resend} from 'resend'
import OrderReceivedEmail from "@/components/emails/OrderRecievedEmail";
const resend  =  new Resend(process.env.RESEND_API_KEY)
// export const config = {
//   api: { bodyParser: false }, // Disable body parsing
// };

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature");

    if (!signature) {
      return new Response('Invalid signature', { status: 401 });
    }

    console.log('Received signature:', signature);

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

     

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      if (!session.customer_details?.email) {
        throw new Error('Missing user email');
      }

      const { userID, orderId } = session.metadata || {
        userID: null,
        orderId: undefined,
      };

      

      if (!userID || !orderId) {
        throw new Error('Invalid request metadata');
      }

      const billingAddress = session.customer_details.address;
      const shippingAddress = session.shipping_details?.address;

      try {
        const updatedOrder = await db.order.update({
          where: { id: orderId, userId: userID },
          data: {
            isPaid: true,
            shippingAddress: {
              create: {
                name: session.customer_details.name!,
                city: shippingAddress?.city!,
                country: shippingAddress?.country!,
                street: shippingAddress?.line1!,
                postalCode: shippingAddress?.postal_code!,
                state: shippingAddress?.state!,
              },
            },
            billingAddress: {
              create: {
                name: session.customer_details.name!,
                city: billingAddress?.city!,
                country: billingAddress?.country!,
                street: billingAddress?.line1!,
                postalCode: billingAddress?.postal_code!,
                state: billingAddress?.state,
              },
            },
          },
        });
        await resend.emails.send({
          from: "CaseAmigo <tanishsaini26@gmail.com>",
          // @ts-ignore
          to: [event.data.object.customer_details.email],
          subject: 'Thanks for your order!',
          react: OrderReceivedEmail({
            orderId,
            orderDate: updatedOrder.createdAt.toLocaleDateString(),
            // @ts-ignore
            shippingAddress: {
              name: session.customer_details!.name!,
              city: shippingAddress!.city!,
              country: shippingAddress!.country!,
              postalCode: shippingAddress!.postal_code!,
              street: shippingAddress!.line1!,
              state: shippingAddress!.state,
            },
          }),
        })

        console.log('Order successfully updated.');
      } catch (dbError) {
        console.error('Database Update Error:', dbError);
        throw new Error('Failed to update order');
      }
    }

    return new Response(JSON.stringify({ result: event, ok: true }), { status: 200 });
  } catch (e: any) {
    console.error('Error in webhook:', e.message, e.stack);
    return new Response(
      JSON.stringify({ message: e.message, ok: false }),
      { status: 500 }
    );
  }
}
