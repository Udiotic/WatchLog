import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import axios from 'axios';

function CreateListDialog({ open, onClose }) {
    const [listName, setListName] = useState('');

    const handleCreate = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:5001/api/user/add-movie-list',
                { name: listName },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    }
                }
            );
            onClose(response.data);
        } catch (error) {
            console.error('Error creating list:', error);
        }
    };

    return (
        <Dialog open={open} onClose={() => onClose()}>
            <DialogTitle>Create List</DialogTitle>
            <DialogContent>
                <TextField
                    label="List Name"
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose()}>Cancel</Button>
                <Button onClick={handleCreate} color="primary">Create</Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateListDialog;
