import React from 'react'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import Loader from 'react-loader-spinner'
import { Clickable } from './Clickable'
import { Image } from './Image'
import { TextInput } from './TextInput'
import { Control, Controller } from 'react-hook-form'
import { ScraperService } from '@/backend/scraperService'
import toast from 'react-hot-toast'

type ImageScraperProps = {
    name: string
    query?: string
    required?: boolean
    formControl: Control<any>
}

export const ImageScraper = (props: ImageScraperProps) => {
    const [imageResultUrls, setImageResultUrls] = useState(null)

    const maxResults = 5

    const [queryStr, setQueryStr] = useState(props.query ?? '')

    const [loading, setLoading] = useState(false)

    const scrape = async () => {
        if (!queryStr) {
            return
        }
        const imageUrls = await ScraperService.scrapeImages(queryStr, maxResults)

        if (imageUrls && imageUrls.length > 0) {
            setImageResultUrls(imageUrls)
        } else {
            toast.error('No results!')
        }
    }

    return (
        <Controller
            name={props.name}
            control={props.formControl}
            rules={{ required: typeof props.required !== 'undefined' ? props.required : false }}
            render={({ field }) => (
                <>
                    <div className="inline-flex w-full">
                        <TextInput
                            name="imageQuery"
                            placeholder="Image Search..."
                            value={queryStr}
                            onChange={setQueryStr}
                        />

                        <button
                            type="button"
                            disabled={!queryStr}
                            className="h-10 px-5 m-2 disabled:opacity-30 disabled:cursor-not-allowed text-white bg-blue-700 rounded-lg focus:shadow-outline -disabled:hover:bg-blue-800"
                            onClick={async () => {
                                setLoading(true)
                                await scrape()
                                setLoading(false)
                            }}
                        >
                            Search
                        </button>
                    </div>
                    {(() => {
                        if (!loading) {
                            if (imageResultUrls && imageResultUrls.length > 0) {
                                return (
                                    <div className="flex-row max-w-md m-auto bg-gray-900 p-2">
                                        {imageResultUrls.map((url: string) => {
                                            return (
                                                <Clickable
                                                    key={nanoid()}
                                                    onClick={() => {
                                                        field.onChange(url)
                                                    }}
                                                >
                                                    <Image
                                                        src={url}
                                                        alt={url}
                                                        className="w-full h-52 my-2"
                                                    />
                                                </Clickable>
                                            )
                                        })}
                                    </div>
                                )
                            } else {
                                if (imageResultUrls && imageResultUrls.length === 0) {
                                    return <p>No Results</p>
                                }
                            }
                        } else {
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
                    })()}
                </>
            )}
        />
    )
}
