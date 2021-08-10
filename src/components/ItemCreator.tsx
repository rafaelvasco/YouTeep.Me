import { useContext, useEffect, useState } from 'react'
import { useFetch } from '@/backend/requestHooks'
import { useForm } from 'react-hook-form'

import toast from 'react-hot-toast'
import { useBus } from 'react-bus'
import { AuthContext } from '@/contexts/authContext'
import { ItemType } from '@/types/ItemType'
import { Select } from './Select'
import { TextInput } from './TextInput'
import { ImageScraper } from './ImageScraper'
import extApi from '@/backend/extApi'
import { createItem } from '@/backend/itemService'
import { ComponentEvents } from './events'
import { ImageInputFile } from './ImageInputFile'
import { getUrlFileExtension } from '@/lib/utils'

type Inputs = {
    itemName: string
    itemImage: File
    itemType: string
    selectedImageURL: string
}

export const ItemCreator = () => {
    const [itemTypes, itemTypesFetchError] = useFetch<ItemType[]>('item/types')

    const { userInfo } = useContext(AuthContext)

    const [expanded, setExpanded] = useState(false)

    const {
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>()

    //const imageUploadRef = useRef(null)

    const eventBus = useBus()

    const onSubmit = async (data: Inputs) => {
        let itemImageFile: File

        if (data.selectedImageURL) {
            itemImageFile = await buildImageFileFromUrl(data.selectedImageURL)
        } else if (data.itemImage) {
            itemImageFile = data.itemImage
        } else {
            toast.error('Item Image is Empty!')
            return
        }

        const result = await createItem({
            name: data.itemName,
            userId: userInfo.id,
            typeId: data.itemType,
            content: '',
            mainImage: itemImageFile,
        })

        if (result) {
            toast.success(`Item Created Successfully!`)

            resetForm()

            eventBus.emit(ComponentEvents.ItemListModified)
        }
    }

    const buildImageFileFromUrl = async (url: string): Promise<File> => {
        const result = await extApi.get<Blob>(url, {
            responseType: 'blob',
        })
        const type = getUrlFileExtension(url)
        const fileName = url.substring(url.lastIndexOf('/') + 1)
        return new File([result.data], fileName, { type: type })
    }

    const resetForm = () => {
        reset()
        // tslint:disable-next-line
        //imageUploadRef.current?.clear()
    }

    useEffect(() => {
        if (itemTypesFetchError) {
            toast.error(`An error ocurred while loading Item Types: ${itemTypesFetchError}`)
        }
    }, [itemTypesFetchError])

    const handleToggleExpandedClick = () => {
        setExpanded(!expanded)
    }

    return (
        <>
            <div className="w-full my-5 mx-auto rounded-xl h-1/2 bg-gray-100 dark:bg-gray-800 shadow-lg p-5 text-gray-800 dark:text-gray-100 relative overflow-hidden min-w-80 max-w-3xl transition-colors">
                <div className="relative mt-1">
                    {expanded ? (
                        <>
                            <form
                                className="grid p-5 grid-cols-1 gap-6"
                                onSubmit={handleSubmit(onSubmit)}
                            >
                                <label className="block">
                                    <span className="text-gray-700 dark:text-gray-200">Name:</span>

                                    <TextInput
                                        name="itemName"
                                        className="mt-1 w-full"
                                        formControl={control}
                                        required={true}
                                    />
                                    <small className="text-red-500">
                                        {errors.itemName && (
                                            <span>Please give the Item a Name.</span>
                                        )}
                                    </small>
                                </label>

                                {userInfo.role === 'ADMIN' ? (
                                    <>
                                        <label className="block">
                                            <span className="text-gray-700 dark:text-gray-200">
                                                Image:
                                            </span>
                                            <ImageInputFile
                                                name="itemImage"
                                                formControl={control}
                                                required={false}
                                            />
                                        </label>
                                        <small className="text-red-500">
                                            {errors.itemImage && (
                                                <span>Please upload an Image for the Item</span>
                                            )}
                                        </small>
                                    </>
                                ) : null}

                                <label className="block">
                                    <span className="text-gray-700 dark:text-gray-200">Type:</span>
                                    {itemTypes ? (
                                        <Select
                                            formControl={control}
                                            required={true}
                                            name="itemType"
                                            className="ml-4"
                                            options={itemTypes.map((type) => {
                                                return {
                                                    label: type.name.toUpperCase(),
                                                    value: type.id,
                                                }
                                            })}
                                        />
                                    ) : null}
                                </label>
                                <ImageScraper
                                    name="selectedImageURL"
                                    formControl={control}
                                    required={true}
                                />
                                <small className="text-red-500">
                                    {errors.selectedImageURL && (
                                        <span>Please search and select an Image for the Item.</span>
                                    )}
                                </small>
                                <button
                                    disabled={isSubmitting}
                                    className="h-10 px-5 m-2 text-white transition-colors duration-150 bg-blue-700 rounded-lg focus:shadow-outline hover:bg-blue-800"
                                    type="submit"
                                >
                                    {!isSubmitting ? 'Create' : 'Please Wait'}
                                </button>
                            </form>
                        </>
                    ) : null}

                    <div className="flex justify-center align-middle">
                        <button
                            onClick={handleToggleExpandedClick}
                            className={`h-10 px-5 w-full outline-none focus:outline-none transition-colors duration-150 ${
                                !expanded
                                    ? 'bg-blue-700 hover:bg-blue-800 dark:text-gray-100 text-white'
                                    : 'dark:bg-gray-800 dark:hover:bg-gray-900 bg-gray-100 hover:bg-gray-200 text-gray-400'
                            } rounded-lg focus:shadow-outline`}
                        >
                            {!expanded ? 'Create Item...' : 'Collapse'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
