// bg-blue-950 border-blue-950
// bg-zinc-900 border-zinc-900
// bg-rose-950 border-rose-950

import { PRODUCTS_PRICES } from "@/config/prodcuts"


export const COLORS = [
    {label: 'Black', value: 'black', tw: 'zinc-900'},
    {label:"Blue", value: 'blue', tw:'blue-950'},
    {label: 'Rose', value: 'rose', tw: 'rose-950'},
] as const 


export const MODELS = {
    name: 'models',
    options: [
        {
            label: 'iPhone X',
            value: 'iPhone X',
        },
        {
            label: 'iPhone 11',
            value: 'iPhone 11',
        },
        {
            label: 'iPhone 12',
            value: 'iPhone 12',
        },
        {
            label: 'iPhone 13',
            value: 'iPhone 13',
        },
        {
            label: 'iPhone 14',
            value: 'iPhone 14',
        },
        {
            label: 'iPhone 15',
            value: 'iPhone 15',
        },
        {
            label: 'iPhone 16',
            value: 'iPhone 16',
        },
        
    ]
} as const

export const MATERIALS = {
    name: 'material',
    options:[
        {
            label: 'Silicone',
            value:'silicone',
            description: undefined,
            price: PRODUCTS_PRICES.material.silicone
        },
        {
            label: 'Soft PolyCarbonate',
            value:'polycarbonate',
            description: 'Scratch resistant',
            price: PRODUCTS_PRICES.material.polycarbonate
        }
    ]
} as const
export const FINISHES = {
    name: 'finish',
    options:[
        {
            label: 'Smooth',
            value:'smooth',
            description: undefined,
            price: PRODUCTS_PRICES.finish.smooth
        },
        {
            label: 'Textured',
            value:'textured',
            description: 'Soft and Grippy',
            price: PRODUCTS_PRICES.finish.textured
        }
    ]
} as const