import React, { useState } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { Rating } from '@mui/material';

function AddMovieDialog({ open, onClose, movie }) {
    const [rating, setRating] = useState(0);
    const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
    const [review, setReview] = useState('');

    const handleAdd = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:5000/api/user/add-watched-movie',
                {
                    movie,
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

            console.log('Movie added:', response.data);
            onClose(); // Close the dialog
        } catch (error) {
            console.error('Error adding movie:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>I watched...</DialogTitle>
            <DialogContent>
                <div style={{ display: 'flex' }}>
                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} style={{ width: '150px', marginRight: '20px' }} />
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
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleAdd} color="primary">Add</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddMovieDialog;
