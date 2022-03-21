import React, { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import { allTodos } from "../graphql/queries";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import { deleteTodo } from '../graphql/mutations';

type Props = {
    isSubmit: boolean
    setIsSubmit: React.Dispatch<React.SetStateAction<boolean>>
}

const RightSide: React.FC<Props> = ({ isSubmit, setIsSubmit }) => {
    type Todo = {
        id: string
        title: string
        checked: boolean
    }

    const [todos, setTodos] = useState<React.SetStateAction<any>>()
    const [isDeleted, setIsDeleted] = useState(false)

    const fetchData = async () => {
        setIsDeleted(false)
        setIsSubmit(false)
        try {
            const data = await API.graphql({
                query: allTodos
            })
            console.log('data', data);
            setTodos(data)
        } catch (err) {
            console.log("err", err);
        }
    }
    const handleDelete = async (id: string) => {
        setIsDeleted(true)
        try {
            await API.graphql({
                query: deleteTodo,
                variables: {
                    id
                }
            })
        } catch (err) {
            console.log("err in deleting", err)
        }
    }

    useEffect(() => {
        fetchData()
    }, [isDeleted, isSubmit])

    return (
        <div>
            {todos?.data?.allTodos.map((todo: Todo) => (
                <Box
                    key={todo.id}
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: '#ccc',
                        padding: '0 10px',
                        borderRadius: '10px',
                    }}
                    m={1}
                >
                    {todo.checked ? (
                        <Checkbox disabled defaultChecked />
                    ) : (
                        <Checkbox disabled />
                    )}
                    <Box sx={{
                        background: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: "20rem",
                        borderRadius: '10px'
                    }}
                        p={2}
                        marginY={2}
                    >
                        <Typography variant="body1">{todo.title}</Typography>

                        <Button
                            onClick={() => handleDelete(todo.id)}
                        >{
                                isDeleted ?
                                    <Typography variant="body1" color="secondary">Deleting...</Typography>
                                    :
                                    <Typography variant="body1" color="danger">Delete</Typography>
                            }
                        </Button>

                    </Box>
                </Box>
            ))}
        </div>
    )
}

export default RightSide;