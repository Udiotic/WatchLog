import React, { useState } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { Rating } from '@mui/material';

function EditJournalEntryDialog({ open, onClose, entry }) {
    const [rating, setRating] = useState(entry.rating);
    const [date, setDate] = useState(new Date(entry.date).toISOString().substr(0, 10));
    const [review, setReview] = useState(entry.review);

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await axios.put(
                'http://localhost:5001/api/user/update-journal-entry',
                {
                    entryId: entry._id,
                    rating,
                    date,
                    review
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    }
                }
            );

            console.log('Entry updated:', response.data);
            onClose(response.data.find(e => e._id === entry._id)); // Pass the updated entry to onClose
        } catch (error) {
            console.error('Error updating entry:', error);
        }
    };

    return (
        <Dialog open={open} onClose={() => onClose()} className="edit-dialog">
            <DialogTitle>Edit Journal Entry</DialogTitle>
            <DialogContent>
                <div style={{ display: 'flex' }}>
                    <img src={`https://image.tmdb.org/t/p/w500${entry.poster_path}`} alt={entry.title} style={{ width: '150px', marginRight: '20px' }} />
                    <div>
                        <TextField
                            label="Date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                            style={{ marginTop: '5px', marginBottom: '20px' }}
                        />
                        <Rating
                            name="rating"
                            value={rating}
                            onChange={(event, newValue) => {
                                setRating(newValue);
                            }}
                        />
                        <TextField
                            label="Review"
                            multiline
                            rows={4}
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            variant="outlined"
                            fullWidth
                        />
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose()}>Cancel</Button>
                <Button onClick={handleSave} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditJournalEntryDialog;
