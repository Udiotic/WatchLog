import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';
import axios from 'axios';

function AddToListDialog({ open, onClose, movie, lists }) {
    const [selectedList, setSelectedList] = useState('');
    const [newListName, setNewListName] = useState('');

    const handleAdd = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            if (selectedList === 'new') {
                const response = await axios.post(
                    'http://localhost:5001/api/user/add-movie-list',
                    { name: newListName },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': token
                        }
                    }
                );
                const newList = response.data[response.data.length - 1];
                await axios.post(
                    'http://localhost:5001/api/user/add-movie-to-list',
                    { listId: newList._id, movie },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': token
                        }
                    }
                );
                onClose(response.data);
            } else {
                await axios.post(
                    'http://localhost:5001/api/user/add-movie-to-list',
                    { listId: selectedList, movie },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': token
                        }
                    }
                );
                onClose();
            }
        } catch (error) {
            console.error('Error adding movie to list:', error);
        }
    };

    return (
        <Dialog open={open} onClose={() => onClose()}>
            <DialogTitle>Add to List</DialogTitle>
            <DialogContent>
                <TextField
                    select
                    label="Select List"
                    value={selectedList}
                    onChange={(e) => setSelectedList(e.target.value)}
                    fullWidth
                    margin="normal"
                >
                    <MenuItem value="new">Add to a new list</MenuItem>
                    {lists.map((list) => (
                        <MenuItem key={list._id} value={list._id}>{list.name}</MenuItem>
                    ))}
                </TextField>
                {selectedList === 'new' && (
                    <TextField
                        label="New List Name"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose()}>Cancel</Button>
                <Button onClick={handleAdd} color="primary">Add</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddToListDialog;
