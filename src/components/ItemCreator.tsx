import { useContext, useEffect, useRef, useState } from 'react'
import { useFetch } from '@/backend/requestHooks'
import { useForm } from 'react-hook-form'

import toast from 'react-hot-toast'
import { useBus } from 'react-bus'
import { AuthContext } from '@/contexts/authContext'
import { createItem } from '@/backend/itemService'
import { ComponentEvents } from './events'
import { ItemType } from '@/types/ItemType'
import { Select } from './Select'
import { TextInput } from './TextInput'
import { ImageInputFile } from './ImageInputFile'
import { ImageScraper } from './ImageScraper'

export const ItemCreator = () => {
    const [itemTypes, itemTypesFetchError] = useFetch<ItemType[]>('item/types')

    const { userInfo } = useContext(AuthContext)

    const [expanded, setExpanded] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        errors,
        formState: { isSubmitSuccessful, isSubmitting },
    } = useForm()

    const imageUploadRef = useRef(null)

    const eventBus = useBus()

    const onSubmit = async (data: any) => {
        const result = await createItem({
            name: data.name,
            userId: userInfo.id,
            typeId: data.itemType ?? '60566a5cf632eba782e13a37',
            content: data.content || '',
            mainImage: data.mainImage[0] ?? null,
            mainImageURL: data.mainImageURL ?? null
        })

        if (result) {
            toast.success(`Item Created Successfully!`)

            resetForm()

            eventBus.emit(ComponentEvents.ItemListModified)
        }
    }

    const resetForm = () => {
        reset()
        // tslint:disable-next-line
        imageUploadRef.current?.clear()
    }

    const formOptions = {
        name: { required: 'Name field is required' },
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
                                {userInfo.role === 'ADMIN' ? (
                                    <label className="block">
                                        <span className="text-gray-700 dark:text-gray-200">Image:</span>
                                        <ImageInputFile
                                            name="mainImage"
                                            formRef={register}
                                            ref={imageUploadRef}
                                        />
                                    </label>

                                ) : null}

                                <label className="block">
                                    <span className="text-gray-700 dark:text-gray-200">Name:</span>
                                    <TextInput
                                        ref={register(formOptions.name)}
                                        name="name"
                                        className="mt-1 w-full"
                                    />
                                    <small className="text-red-500">
                                        {errors.name && errors.name.message}
                                    </small>
                                </label>

                                <label className="block">
                                    <span className="text-gray-700 dark:text-gray-200">Type:</span>
                                    {itemTypes ? (
                                        <Select
                                            name="itemType"
                                            className="ml-4"
                                            ref={register}
                                            options={itemTypes.map((type) => {
                                                return {
                                                    label: type.name.toUpperCase(),
                                                    value: type.id,
                                                }
                                            })}
                                        />
                                    ) : null}
                                </label>



                                <button
                                    disabled={isSubmitting}
                                    className="h-10 px-5 m-2 text-white transition-colors duration-150 bg-blue-700 rounded-lg focus:shadow-outline hover:bg-blue-800"
                                    type="submit"
                                >
                                    {!isSubmitting ? 'Create' : 'Please Wait'}
                                </button>
                            </form>
                            <ImageScraper />
                        </>

                    ) : null}

                    <div className="flex justify-center align-middle">
                        <button
                            onClick={handleToggleExpandedClick}
                            className={`h-10 px-5 w-full outline-none focus:outline-none transition-colors duration-150 ${!expanded
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
