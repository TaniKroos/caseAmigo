import { clsx, type ClassValue } from "clsx"
import { Metadata } from "next"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatPrice = (price: number) => {
  const formatter = new Intl.NumberFormat('en-US',{
    style: 'currency',
    currency: 'INR',
     
  })
  return formatter.format(price)
}

export function constructMetadata({
  title = 'CaseAmigo - High Quality cases',
  description = 'We deliver high-quality cases for iPhone, iPad, iWatch, Apple TVs and other Apple devices',
  image = '/thumbnail.png',
  icons = '/favicon.ico',
}:{
  title?: string,
  description?: string,
  image?: string,
  icons?: string,
} = {} ) : Metadata {
  return {
    title,
    description,
    openGraph:{
      title,
      description,
      images:[{url: image}]
    },
    icons,
    metadataBase: new URL("http://localhost:3000/")
  }
}