import React, { useEffect, useImperativeHandle, useState } from 'react'
import { Control, Controller } from 'react-hook-form'

type ImageInputFileProps = {
    name: string
    formControl: Control<any>
    required?: boolean
}

export const ImageInputFile = React.forwardRef((props: ImageInputFileProps, ref) => {
    const [imageSource, setImageSource] = useState(null)

    useImperativeHandle(ref, () => ({
        clear() {
            setImageSource(null)
        },
    }))

    useEffect(() => {
        // Unload Object URL when component is unmounted
        return () => {
            if (imageSource) {
                URL.revokeObjectURL(imageSource)
            }
        }
    }, [imageSource])

    const handleChange = (ev, formField) => {
        if (ev.target.files?.[0]) {
            const url = URL.createObjectURL(ev.target.files[0])
            setImageSource(url)
            formField.onChange(ev.target.files[0])
        }
    }

    return (
        <>
            <Controller
                name={props.name}
                control={props.formControl}
                rules={{ required: typeof props.required !== 'undefined' ? props.required : false }}
                render={({ field }) => (
                    <>
                        <input
                            accept="image/png, image/jpeg"
                            hidden={true}
                            name={props.name}
                            onChange={(ev) => {
                                handleChange(ev, field)
                            }}
                            type="file"
                        />
                        <div className="flex items-center justify-center mt-1 bg-gray-200 dark:bg-gray-900 p-2 rounded-lg shadow-inner border-none text-black dark:text-white focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                            {imageSource ? (
                                <img
                                    src={imageSource}
                                    alt="Image Upload Preview"
                                    className="lg:max-h-32 md:max-h-16 object-cover object-center bg-white"
                                />
                            ) : (
                                <span>Upload...</span>
                            )}
                        </div>
                    </>
                )}
            />
        </>
    )
})
