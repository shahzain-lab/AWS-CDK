import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import FormBox from './FormBox'
import { GlobalContext } from '../context/GlobalContext';


const ModelBox = () => {
    const { setBookmark, setIsUpdate, isOpen, setIsOpen } = useContext(GlobalContext);
    const handleOpen = () => {
        setIsOpen(true)
        setIsUpdate(false)
    };
    const handleClose = () => {
        setIsOpen(false)
        setIsUpdate(false)
        setBookmark({ id: '', title: '', url: '' })
    };

    return <div>
        <Box
            sx={{
                width: '100%',
                textAlign: 'center'
            }}
        >
            <Button onClick={handleOpen} size="large" variant="contained" color="secondary">Add Bookmark</Button>
        </Box>
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
            }}>
                <FormBox />
            </Box>
        </Modal>
    </div>;
};

export default ModelBox;