import { scrapeImages } from "@/backend/scraperService"
import { nanoid } from "nanoid"
import { useState } from "react"
import { useEffect } from "react"
import Loader from 'react-loader-spinner'
import { Image } from "./Image"
import { TextInput } from "./TextInput"

type ImageScraperProps = {
    query: string
}

export const ImageScraper = () => {

    const [imageResultUrls, setImageResultUrls] = useState(null)

    const [queryStr, setQueryStr] = useState(null)

    const [loading, setLoading] = useState(false)

    const scrape = async () => {
        const imageUrls = await scrapeImages(queryStr, 5)
        setImageResultUrls(imageUrls)
    }



    return (
        <>
            <label>
                Query:
                <TextInput listener={setQueryStr} name="query" />
            </label>

            <button className="h-10 px-5 m-2 text-white transition-colors duration-150 bg-blue-700 rounded-lg focus:shadow-outline hover:bg-blue-800" onClick={async () => {
                setLoading(true)
                await scrape()
                setLoading(false)
            }}>Scrape</button>
            {
                (() => {

                    if (!loading) {
                        if (imageResultUrls && imageResultUrls.length > 0) {

                            return(<div className="flex-row max-w-md m-auto bg-gray-900 p-2">
                              {
                                 imageResultUrls.map(url => {
                                     return (
                                        <Image src={url} alt={url} className="w-full h-52 my-2"/>
                                     )
                                 })
                              }
                            </div>)


                        }
                        else {
                            if (imageResultUrls && imageResultUrls.length === 0) {
                                return (<p>No Results</p>)
                            }
                        }
                    }
                    else {
                        return (
                            <div className="flex-wrap m-auto">
                                 <Loader
                                type="Puff"
                                color="#00BFFF"
                                height={100}
                                width={100}
                                timeout={3000} //3 secs
                            />
                            </div>
                           
                        )
                    }

                    return null

                })()
            }


        </>
    )
}