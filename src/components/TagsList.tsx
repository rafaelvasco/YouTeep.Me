import { useBus } from 'react-bus'
import { ComponentEvents } from './events'

type Props = {
    tagList: string[]
}

const TagsList = ({ tagList }: Props) => {
    const msgBus = useBus()

    return (
        <>
            <div className="flex flex-row flex-wrap my-3">
                {tagList.length > 0
                    ? tagList.map((t) => (
                          <div
                              key={t}
                              onClick={() => {
                                  msgBus.emit(ComponentEvents.TagSelected, t)
                              }}
                              className="cursor-default mx-1 px-2 py-1 text-xs bg-purple-500 rounded-xl text-white"
                          >
                              {t}
                          </div>
                      ))
                    : ''}
            </div>
        </>
    )
}

export default TagsList
