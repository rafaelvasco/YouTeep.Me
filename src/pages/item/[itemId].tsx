import { PageSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata.json'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Loader from 'react-loader-spinner'
import MarkdownIt from 'markdown-it'
import Image from 'next/image'
import api from '@/backend/api'
import { Item } from '@/types/Item'
import toast from 'react-hot-toast'
import { SectionContainer } from '@/components/SectionContainer'

const mdParser = new MarkdownIt()

const ItemDetail = () => {
    const router = useRouter()

    const { itemId } = router.query

    const [item, setItem] = useState(null)
    const [itemContent, setItemContent] = useState(null)

    const fetchItem = async () => {
        try {
            const result = await api.get<Item>('item', {
                params: {
                    id: itemId,
                },
            })

            if (result.status === 200) {
                const item = result.data

                setItem(item)

                if (item.content) {
                    setItemContent(mdParser.render(item.content))
                }
            }
        } catch (e) {
            toast.error(`Error while fetching Item: ${e.message | e}`)
        }
    }

    useEffect(() => {
        fetchItem()
    }, [])

    return (
        <>
            <PageSeo
                title={siteMetadata.title}
                description={siteMetadata.description}
                url={siteMetadata.siteUrl}
            />

            <div className="my-5">
                {item ? (
                    <div className="max-w-5xl w-full my-5 mx-auto">
                        <div className="grid grid-cols-1 gap-10">
                            <Image
                                alt={item.name}
                                src={item.mainImage ?? '/static/images/time-machine.jpg'}
                                className="rounded-md object-contain object-center bg-white"
                                width={256}
                                height={512}
                            />

                            <div>
                                {itemContent ? (
                                    <div
                                        className="overflow-hidden max-w-2xl mx-auto custom-html-style text-justify text-gray-800 dark:text-gray-100"
                                        dangerouslySetInnerHTML={{ __html: itemContent }}
                                    ></div>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <h1 className="text-gray-800 dark:text-gray-100 text-lg">
                                            No Content
                                        </h1>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-12">
                        <div className="flex flex-wrap justify-center">
                            <Loader
                                type="Puff"
                                color="#00BFFF"
                                height={100}
                                width={100}
                                timeout={3000} //3 secs
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default ItemDetail
