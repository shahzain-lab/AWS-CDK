import React from 'react'
import { GlobalProvider } from '../context/GlobalContext'
import Client from './client'

type Props = {
    element: React.ReactNode
}

export const wrapRootElement: React.FC<Props> = ({ element }) => {
    return (
        <Client>
            <GlobalProvider>
                {element}
            </GlobalProvider>
        </Client>
    )
}
