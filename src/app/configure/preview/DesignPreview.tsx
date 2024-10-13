'use client'
import Confetti from 'react-dom-confetti'
import { useEffect, useState } from 'react'
import Phone from '@/components/Phone'
import { Configuration } from '@prisma/client'
import { COLORS, FINISHES, MODELS } from '@/validators/option-validator'
import { cn, formatPrice } from '@/lib/utils'
import { Check, ArrowRight } from 'lucide-react'
import { BASE_PRICE, PRODUCTS_PRICES } from '@/config/prodcuts'
import { Button } from '@/components/ui/button'

const DesignPreview = ({ configuration }: { configuration: Configuration }) => {
    const [showConfetti, setShowConfetti] = useState(false)
    useEffect(() => {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)  // Change this value to control confetti duration.
    }, [])
    const { color, model, finish, material
    } = configuration
    const tw = COLORS.find((suppoertedColor) => suppoertedColor.value === color)?.tw
    const { label: modelLable } = MODELS.options.find(({ value }) => value === model)!
    let totapPrice: number = BASE_PRICE
    if (material === 'polycarbonate') totapPrice += PRODUCTS_PRICES.material.polycarbonate
    if (finish === 'textured') totapPrice += PRODUCTS_PRICES.finish.textured
     
    return (
        <>
            <div aria-hidden='true'
                className='pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center'>
                <Confetti
                    active={showConfetti}
                    config={{ elementCount: 200, spread: 90 }}
                />
            </div>
            <div className='mt-20 grid grid-cols-1 text-sm sm:grid-cols-12 sm:grid-rowa-1
            sm:gap-x-6 md:gap-x-8 lg:gap-x-12'>
                <div className='sm:col-span-4 md:col-span-3 md:row-span-2 md:row-end-2  '>
                    <Phone
                        className={cn(`bg-${tw}`)}
                        imgSrc={configuration.croppedImageUrl!} />
                </div>
                <div className='mt-6 sm:col-span-9 sm:mt-0 md:row-end-1'>
                    <h3 className='text-2xl font-bold tracking-tight text-gray-900'>Your {modelLable} Case</h3>
                    <div className='mt-3 flex items-center gap-1.5 text-base'>
                        <Check className='h-4 w-4 text-green-500' />
                        In Stock ready to ship
                    </div>
                </div>
                <div className='sm:col-span-12 md:col-span-9 text-base'>
                    <div className='grid grid-cols-1 gap-y-8 border-b border-gray-200
                    py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10'>
                        <div>
                            <p className='font-medium text-zinc-950'>Highlights</p>
                            <ol className='mt-3 text-zinc-700 list-disc list-inside'>
                                <li>Wireless Charging compatible</li>
                                <li>TPU shock absorption</li>
                                <li>Packaging made from recycled materials</li>
                                <li>5 Year print warranty</li>
                            </ol>
                        </div>
                        <div>
                            <p className='font-medium text-zinc-950'>
                                Materials
                            </p>
                            <ol className='mt-3 text-zinc-700 list-disc list-inside'>
                                <li>High Quality Durable Material </li>
                                <li>Scratch and fingerprint resistent coating</li>

                            </ol>
                        </div>
                    </div>
                    <div className='mt-8 '>
                        <div className='bg-gray-50 p-6 sm:rounded-lg sm:p-8'>
                            <div className='flow-root text-sm'>
                                <div className='flex items-center justify-between py-1 mt-2'>
                                    <p className='text-gray-600'>Base price</p>
                                    <p className='font-medium texxt-gray-900'>{formatPrice(BASE_PRICE / 100)}</p>
                                </div>
                                {finish === 'textured' ? (
                                    <div className='flex items-center justify-between py-1 mt-2'>
                                        <p className='text-gray-600'>Textured Finish</p>
                                        <p className='font-medium texxt-gray-900'>{formatPrice(PRODUCTS_PRICES.finish.textured / 100)}</p>
                                    </div>
                                ) : null}
                                {material === 'polycarbonate' ? (
                                    <div className='flex items-center justify-between py-1 mt-2'>
                                        <p className='text-gray-600'>PolyCarbonate Material</p>
                                        <p className='font-medium texxt-gray-900'>{formatPrice(PRODUCTS_PRICES.material.polycarbonate / 100)}</p>
                                    </div>
                                ) : null}
                                <div className='my-2 h-px bg-gray-200' />
                                <div className='flex items-center justify-between py-2'>
                                    <p className='font-semibold text-gray-900'>
                                        Order Total
                                    </p>
                                    <p className='font-semibold text-gray-900'>
                                        {formatPrice(totapPrice /100)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='mt-8 flex justify-end pb-12'>
                            <Button
                            disabled={true}
                                isLoading={true}
                                loadingText='loading'
                                className='px-4 sm:px-6 lg:px-8'>
                                Check out <ArrowRight className='h-4 w-4 ml-1.5 inline' />
                            </Button>
                        </div>
 
                    </div>

                </div>

            </div>

        </>
    )
}
export default DesignPreview