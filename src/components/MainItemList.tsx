import { useEffect, useState } from 'react'
import { useListener } from 'react-bus'
import { ComponentEvents } from './events'
import { Paginator } from './Paginator'
import { ItemCard } from './ItemCard'
import { useAppContext } from '@/contexts/appContext'
import Loader from 'react-loader-spinner'

export const MainItemList = () => {
    const appState = useAppContext()

    const [page, setPage] = useState(appState.getMainFilter().page)

    useEffect(() => {
        setPage(appState.getMainFilter().page)
    }, [appState.getMainFilter().page])

    useEffect(() => {
        if (page !== appState.getMainFilter().page) {
            appState.setMainFilterPage(page)
        }
    }, [page])

    useListener(ComponentEvents.ItemListModified, () => {
        appState.mutateMainItemList()
    })

    return (
        <>
            {appState.getMainItemList() ? (
                <div>
                    <div className="py-12">
                        <div className="flex flex-wrap justify-center">
                            {appState.getMainItemList().items &&
                            appState.getMainItemList().items.length > 0 ? (
                                appState
                                    .getMainItemList()
                                    .items.map((item) => <ItemCard key={item.id} item={item} />)
                            ) : (
                                <h2>No Items</h2>
                            )}
                        </div>
                    </div>

                    <Paginator
                        page={page}
                        count={appState.getMainItemList().totalQty}
                        paginate={(delta: number) => {
                            setPage(page + delta)
                        }}
                    />
                </div>
            ) : (
                <div className="py-12">
                    <div className="flex flex-wrap justify-center">
                        <Loader
                            type="Puff"
                            color="#00BFFF"
                            height={100}
                            width={100}
                            timeout={3000} //3 secs
                        />
                    </div>
                </div>
            )}
        </>
    )
}
