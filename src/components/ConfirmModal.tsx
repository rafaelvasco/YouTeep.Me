export type ConfirmModalProps = {
    onConfirm: () => void
    onClose: () => void
    title: string
    message: string
    confirmButtonLabel: string
    cancelButtonLabel: string
}

export const ConfirmModal = (props: ConfirmModalProps) => {
    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-80 flex">
            <div className="relative p-4 bg-white w-full max-w-md m-auto flex-col flex rounded-lg shadow-lg">
                <div className="bg-yellow-300 rounded-lg px-5 py-1">
                    <h1 className="text-gray-900 ">{props.title}</h1>
                </div>

                <div className="py-10">
                    <p className="text-gray-900">{props.message}</p>
                </div>

                <div className="flex justify-end absolute right-4 bottom-4">
                    <button
                        className="bg-gray-400 hover:bg-gray-500 focus:bg-gray-700 inline-flex outline-none focus:outline-none rounded-lg px-3 py-1"
                        onClick={props.onClose}
                    >
                        {props.cancelButtonLabel}
                    </button>
                    <button
                        className="bg-green-400 hover:bg-green-500 inline-flex focus:bg-green-700 outline-none focus:outline-none rounded-lg px-3 py-1 ml-2"
                        onClick={props.onConfirm}
                    >
                        {props.confirmButtonLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
