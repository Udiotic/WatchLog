import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                setUser(decodedUser.user);
            } catch (error) {
                console.error('Failed to decode token', error);
                localStorage.removeItem('token');
            }
        }
    }, []);

    const login = (token) => {
        try {
            const decodedUser = jwtDecode(token);
            localStorage.setItem('token', token);
            localStorage.setItem('username', decodedUser.user.username);
            setUser(decodedUser.user);
        } catch (error) {   
            console.error('Failed to decode token', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
