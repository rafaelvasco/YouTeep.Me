type ClickableProps = {
    onClick: () => void
    children: React.ReactNode
}

export const Clickable = (props: ClickableProps) => {
    return (
        <div
            onClick={() => {
                props.onClick()
            }}
        >
            {props.children}
        </div>
    )
}
