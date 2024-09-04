import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader'

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/current`, { withCredentials: true });
                // console.log('Fetched user data:', response.data);
                setCurrentUser(response.data);
            } catch (error) {
                console.error('Error fetching current user:', error);
                setCurrentUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, []);
    
    if (loading) {
        return <Loader/> // Show a loading spinner or message while fetching
    }

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;