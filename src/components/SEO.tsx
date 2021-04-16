import { NextSeo } from 'next-seo'
import siteMetadata from '@/data/siteMetadata.json'

export const SEO = {
    title: siteMetadata.title,
    description: siteMetadata.description,
    openGraph: {
        type: 'website',
        locale: siteMetadata.language,
        url: siteMetadata.siteUrl,
        title: siteMetadata.title,
        description: siteMetadata.description,
        images: [
            {
                url: `${siteMetadata.siteUrl}${siteMetadata.socialBanner}`,
                alt: siteMetadata.title,
                width: 1200,
                height: 600,
            },
        ],
    },
    twitter: {
        handle: siteMetadata.twitter,
        site: siteMetadata.twitter,
        cardType: 'summary_large_image',
    },
    additionalMetaTags: [
        {
            name: 'author',
            content: siteMetadata.author,
        },
    ],
}

export const PageSeo = ({ title, description, url }) => {
    return (
        <NextSeo
            title={`${title} - ${siteMetadata.title}`}
            description={description}
            canonical={url}
            openGraph={{
                url,
                title,
                description,
            }}
        ></NextSeo>
    )
}
