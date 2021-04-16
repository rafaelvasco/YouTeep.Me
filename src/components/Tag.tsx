import Link from 'next/link'

type Props = {
    text: string
}

export const Tag = ({ text }: Props) => {
    return (
        <Link href={`/tags/${text}`}>
            <a className="mr-3 text-sm font-medium text-blue-500 uppercase hover:text-blue-600 dark:hover:text-blue-400">
                {text.split(' ').join('-')}
            </a>
        </Link>
    )
}
