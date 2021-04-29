import { useContext, useEffect } from 'react'
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

export const ItemCreator = () => {
    const [itemTypes, itemTypesFetchError] = useFetch<ItemType[]>('item/types')

    const { userInfo } = useContext(AuthContext)

    const {
        register,
        handleSubmit,
        reset,
        errors,
        formState: { isSubmitSuccessful, isSubmitting },
    } = useForm()

    const eventBus = useBus()

    const onSubmit = async (data: any) => {
        const result = await createItem({
            name: data.name,
            userId: userInfo.id,
            typeId: data.itemType,
            content: data.content || '',
            mainImage: data.mainImage[0],
        })

        if (result) {
            toast.success(`Item Created Successfully!`)

            reset()

            eventBus.emit(ComponentEvents.ItemListModified)
        }
    }

    const formOptions = {
        name: { required: 'Name field is required' },
        mainImage: { required: 'Please select a main Image for the Item.' },
    }

    useEffect(() => {
        if (itemTypesFetchError) {
            toast.error(`An error ocurred while loading Item Types: ${itemTypesFetchError}`)
        }
    }, [itemTypesFetchError])

    return (
        <>
            <div className="w-full my-5 mx-auto rounded-xl bg-gray-100 dark:bg-gray-800 shadow-lg p-10 text-gray-800 dark:text-gray-100 relative overflow-hidden min-w-80 max-w-3xl transition-colors">
                <div className="relative mt-1">
                    <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit(onSubmit)}>
                        <label className="block">
                            <span className="text-gray-700 dark:text-gray-200">Image:</span>
                            <ImageInputFile
                                name="mainImage"
                                ref={register(formOptions.mainImage)}
                            />
                            {/* <input
                                id="mainImage"
                                ref={register(formOptions.mainImage)}
                                className="bg-gray-200 dark:bg-gray-900 p-2 w-full min-w-min rounded-lg shadow-inner border-none text-black dark:text-white focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                name="mainImage"
                                type="file"
                            /> */}
                            <small className="text-red-500">
                                {errors.mainImage && errors.mainImage.message}
                            </small>
                        </label>
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
                            {/* <select
                                name="itemType"
                                ref={register}
                                className="bg-white dark:bg-gray-900 uppercase block w-full mt-1 rounded-md border-gray-200 dark:border-gray-800 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            >
                                {itemTypes ? (
                                    itemTypes.map((t) => {
                                        return (
                                            <option key={t.id} value={t.id} className="uppercase">
                                                {t.name}
                                            </option>
                                        )
                                    })
                                ) : (
                                    <option>LOADING...</option>
                                )}
                            </select> */}
                        </label>

                        <button
                            disabled={isSubmitting}
                            className="h-10 px-5 m-2 text-indigo-100 transition-colors duration-150 bg-blue-700 rounded-lg focus:shadow-outline hover:bg-blue-800"
                            type="submit"
                        >
                            {!isSubmitting ? 'Create' : 'Please Wait'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}
