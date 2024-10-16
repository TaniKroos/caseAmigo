'use server'

import { db } from "@/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { tree } from "next/dist/build/templates/app-page"

export const getPaymentStatus = async ({orderId} :{orderId : string}) => {
    const {getUser} = getKindeServerSession()
    const user = await getUser()

    if (!user?.id ||!user.email) {
        throw new Error('You need to login')
    }
    // check if user has a valid payment session
    const order = await db.order.findFirst({
        where:{
            id: orderId,
            userId: user.id,
        },
        include:{
            billingAddress: true,
            configuration: true,
            shippingAddress: true,
            user: true
        }
        
    })
    if(!order){
        throw new Error('Invalid order')
    }

    if(order.isPaid){
        return order
    }else{
        return false
    }
}