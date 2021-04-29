import { ItemType } from './ItemType'
import { User } from './User'

export type Item = {
    id: string
    name: string
    content: string
    mainImage: string
    type: ItemType
    user: User
    active: boolean
    createdAt: Date
    updatedAt: Date
}
