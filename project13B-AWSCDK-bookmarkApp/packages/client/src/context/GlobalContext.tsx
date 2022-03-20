import React, { createContext, useState } from 'react';
import { bookmarks } from '../graphql/queries';
import { API } from 'aws-amplify'

export type Bookmark = {
    id?: string
    title?: string
    url?: string
}

interface Fields {
    fetchBookmarks: () => void
    bookmarksList: {
        data: {
            bookmarks: [Bookmark]
        }
    }
    bookmark: Bookmark
    setBookmark: React.Dispatch<React.SetStateAction<{}>>
    isUpdate: boolean
    setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const GlobalContext = createContext<Fields>({
    fetchBookmarks: () => '',
    bookmarksList: {
        data: {
            bookmarks: [{ id: '', title: '', url: '' }]
        }
    },
    bookmark: {},
    setBookmark: () => '',
    isOpen: false,
    setIsOpen: () => '',
    isUpdate: false,
    setIsUpdate: () => '',
});

type Props = {
    children: React.ReactNode
}

export const GlobalProvider: React.FC<Props> = ({ children }) => {
    const [bookmarksList, setBookmarksList] = useState<any>({})
    const [bookmark, setBookmark] = useState({});
    const [isUpdate, setIsUpdate] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const fetchBookmarks = async () => {
        try {
            const data = await API.graphql({
                query: bookmarks
            })
            setBookmarksList(data)
            console.log(data);
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <GlobalContext.Provider value={{
            fetchBookmarks,
            bookmarksList,
            bookmark,
            setBookmark,
            isOpen,
            setIsOpen,
            isUpdate,
            setIsUpdate
        }}>
            {children}
        </GlobalContext.Provider>
    )
}