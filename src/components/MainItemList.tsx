import { Paginator } from './Paginator'
import { ItemCard } from './ItemCard'
import { useAppContext } from '@/contexts/appContext'
import Loader from 'react-loader-spinner'

export const MainItemList = () => {
    const appState = useAppContext()

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
                        page={appState.getMainFilterPage()}
                        count={appState.getMainItemList().totalQty}
                        paginate={(delta: number) => {
                            appState.setMainFilterPage(appState.getMainFilterPage() + delta)
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
