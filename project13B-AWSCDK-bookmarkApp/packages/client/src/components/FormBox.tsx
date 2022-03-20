import React, { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { API } from 'aws-amplify'
import { GlobalContext } from '../context/GlobalContext';
import { createBookmark, updateBookmark } from '../graphql/mutations';

const FormBox = () => {
    const { fetchBookmarks, bookmark, setBookmark, isUpdate } = useContext(GlobalContext);
    const [title, setTitle] = useState(bookmark.title);
    const [url, setUrl] = useState(bookmark.url);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (title && url) {
            console.log(isUpdate)
            try {
                if (isUpdate) {
                    const data = await API.graphql({
                        query: updateBookmark,
                        variables: {
                            id: bookmark.id,
                            title: title,
                            url: url
                        }
                    })
                    console.log("UpdatingBookmark", data);
                    fetchBookmarks()
                    setBookmark({ id: '', title: '', url: '' })
                }
                else {
                    const data = await API.graphql({
                        query: createBookmark,
                        variables: {
                            title: title,
                            url: url
                        }
                    })
                    fetchBookmarks()
                    console.log("creatingBookmarks", data);
                    setBookmark({ title: '', url: '' })
                }
            } catch (err) {
                console.log("error in creating bookmark", err);
            }

        }
    }
    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '45ch' },
                outline: 'none'
            }}
            noValidate
            onSubmit={handleSubmit}
        >
            <TextField
                id="standard-basic"
                label="Enter Name"
                type="text"
                required
                variant="standard"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <TextField
                id="standard-basic"
                label="Enter URL"
                type="url"
                required
                variant="standard"
                value={url}
                onChange={e => setUrl(e.target.value)}
            />
            <Button type="submit" size='large' variant='contained'>Submit</Button>
        </Box>
    );

};

export default FormBox;