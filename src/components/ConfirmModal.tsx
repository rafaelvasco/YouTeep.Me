export type ConfirmModalProps = {
    title: string
    message: string
}

export const ConfirmModal = (props: ConfirmModalProps) => {
    return (
        <>
            <div className="bg-yellow-300 rounded-lg px-5 py-1">
                <h1 className="text-gray-900 ">{props.title}</h1>
            </div>

            <div className="py-10">
                <p className="text-gray-900">{props.message}</p>
            </div>
        </>
    )
}
