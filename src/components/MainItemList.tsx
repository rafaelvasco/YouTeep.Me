import { Paginator } from './Paginator'
import { ItemCard } from './ItemCard'
import { useAppContext } from '@/contexts/appContext'
import Loader from 'react-loader-spinner'
import { useEffect } from 'react'
import { useAppActions } from '@/contexts/appActionsContext'

export const MainItemList = () => {
    const appState = useAppContext()
    const appActions = useAppActions()

    useEffect(() => {
        appActions.queryItems()
    }, [])

    console.log('Main Item List Render')

    return (
        <>
            {!appState.isLoadingResultList() && appState.getItemList() ? (
                <div>
                    <div className="py-12">
                        <div className="flex flex-wrap justify-center">
                            {appState.getItemList().items &&
                            appState.getItemList().items.length > 0 ? (
                                appState
                                    .getItemList()
                                    .items.map((item) => <ItemCard key={item.id} item={item} />)
                            ) : (
                                <h2>No Items</h2>
                            )}
                        </div>
                    </div>

                    <Paginator
                        page={appState.getItemFilterPage()}
                        count={appState.getItemList().totalQty}
                        paginate={(delta: number) => {
                            appState.setItemFilterPage(appState.getItemFilterPage() + delta)
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
