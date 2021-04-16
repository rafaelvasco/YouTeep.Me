import { useContext, useEffect } from 'react'
import { useFetch } from '@/backend/requestHooks'
import { useForm } from 'react-hook-form'

import toast from 'react-hot-toast'
import { useBus } from 'react-bus'
import { AuthContext } from '@/contexts/authContext'
import { createItem } from '@/backend/itemService'
import { ComponentEvents } from './events'
import { ItemType } from '@/types/ItemType'
import { Item } from '@/types/Item'

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
        const item: Item = {
            id: null,
            userId: userInfo.id,
            name: data.name,
            type: itemTypes.filter((it) => it.id === data.itemType)[0],
        }

        const result = await createItem(item)

        if (result) {
            toast.success(`Item Created Successfully!`)

            reset()

            eventBus.emit(ComponentEvents.ItemListModified)
        }
    }

    const formOptions = {
        name: { required: 'Name field is required' },
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
                            <span className="text-gray-700 dark:text-gray-200">Name:</span>
                            <input
                                id="name"
                                ref={register(formOptions.name)}
                                className="bg-white dark:bg-gray-900 mt-1 block w-full rounded-md border-gray-200 dark:border-gray-800 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                name="name"
                                type="text"
                                autoComplete="name"
                            />
                            <small className="text-red-500">
                                {errors.name && errors.name.message}
                            </small>
                        </label>

                        <label className="block">
                            <span className="text-gray-700 dark:text-gray-200">Type:</span>
                            <select
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
                            </select>
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
