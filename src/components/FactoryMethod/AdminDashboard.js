import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const AdminDashboard = () => {
    const history = useHistory();

    useEffect(() => {
        history.push("/Menu"); 
    }, [history]);

    return null; // No renderiza nada, solo redirige
};

export default AdminDashboard;
