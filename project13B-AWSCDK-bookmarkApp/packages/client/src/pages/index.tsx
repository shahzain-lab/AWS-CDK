import React, { useEffect, useState, useContext } from "react";
import { Bookmark, GlobalContext } from "../context/GlobalContext";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CallMadeIcon from '@mui/icons-material/CallMade';
import { API } from 'aws-amplify';
import Model from "../components/Model";
import { deleteBookmark } from "../graphql/mutations";

export default function Home() {
  const { fetchBookmarks, bookmarksList, setBookmark, setIsOpen, setIsUpdate } = useContext(GlobalContext)


  console.log("bookmarksList here", bookmarksList)

  const handleDelete = async (id?: string) => {
    try {
      await API.graphql({
        query: deleteBookmark,
        variables: {
          id
        }
      })
      fetchBookmarks()
    } catch (err) {
      console.log("error in deleting", err)
    }
  }

  useEffect(() => {
    fetchBookmarks()
  }, [])

  const handleUpdate = (id?: string) => {
    const upt = bookmarksList.data.bookmarks.filter((item: Bookmark) => item.id === id);
    upt.filter((item: Bookmark) => {
      setBookmark({ id: item.id, title: item.title, url: item.url });
    })
    setIsOpen(true)
    setIsUpdate(true)
  }

  return (<div>
    <Model />
    {bookmarksList && bookmarksList?.data && (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
        marginY={5}
      >
        {bookmarksList?.data?.bookmarks.map((d: Bookmark) => (
          <Box
            key={d.id}
            sx={{
              boxShadow: '-1px 2px 9px -2px rgba(0,0,0,0.69)',
              background: 'white',
              width: '40%',
              textAlign: 'center',
              borderRadius: '10px',
            }}
            p={2}
            margin={2}
          >
            <Typography variant="body2"
              sx={{
                backgroundColor: '#cccccc',
                padding: '5px 0',
                borderRadius: '5px'
              }}>{d.url}</Typography>

            <Box
              key={d.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body1">{d.title}</Typography>

              <Box>
                <Button
                  onClick={() => handleDelete(d.id)}
                >
                  <DeleteIcon color="secondary" />
                </Button>
                <Button
                  onClick={() => handleUpdate(d.id)}
                >
                  <EditIcon color="secondary" />
                </Button>
                <a
                  href={`${d.url}`}
                  target="_blank"
                >
                  <Button>
                    <CallMadeIcon color="secondary" />
                  </Button>
                </a>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    )}
  </div>)
}
