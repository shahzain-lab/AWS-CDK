import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { API } from 'aws-amplify';
import { createTodo } from "../graphql/mutations";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';

type Props = {
    setIsSubmit: React.Dispatch<React.SetStateAction<boolean>>
}

const LeftSide: React.FC<Props> = ({ setIsSubmit }) => {
    const [title, setTitle] = useState('');
    const [checked, setChecked] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const onSubmit = async () => {
        setTitle('')
        setIsSubmit(true)
        try {
            const todo = {
                title,
                checked
            }
             await API.graphql({
                query: createTodo,
                variables: {
                    todo,
                }
            })
            setIsSubmit(false)
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <Box
            sx={{
                width: '50%',
                padding: '0 1.5rem'
            }}
        >
            <Box>
                <TextField
                    id="outlined-basic"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value)
                        setIsTyping(true)
                    }}
                    required
                    sx={{ width: '100%', marginY: '10px' }}
                    label="Enter Text"
                    variant="outlined"
                />
            </Box>
            <Box sx={{
                background: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: "100%",
                marginY: '2rem',
                borderRadius: '10px'
            }}
                p={2}
            >
                <Typography variant="body1">{title}</Typography>
                {isTyping && !!title ? checked ?
                    <Checkbox defaultChecked /> :
                    <Checkbox onClick={() => setChecked(true)} />
                    : null}
            </Box>
            <Button type="submit" onClick={onSubmit} sx={{ width: '100%' }} variant="contained">Submit</Button>
        </Box>
    );
}
export default LeftSide