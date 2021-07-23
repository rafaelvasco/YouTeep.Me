import React, { useEffect, useImperativeHandle, useState } from 'react'

type ImageInputFileProps = {
    name: string
    formRef?: Function
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

    const handleChange = (ev) => {
        if (ev.target.files?.[0]) {
            setImageSource(URL.createObjectURL(ev.target.files[0]))
        }
    }

    return (
        <>
            <input
                accept="image/png, image/jpeg"
                hidden={true}
                ref={(el) => {
                    if (typeof ref === 'function') {
                        ref(el)
                    } else if (ref) {
                        ref.current = el
                    }

                    if (props.formRef) {
                        props.formRef(el)
                    }
                }}
                name={props.name}
                onChange={handleChange}
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
    )
})
