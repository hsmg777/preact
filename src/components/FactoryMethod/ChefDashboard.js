import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const ChefDashboard = ({ userId }) => {
    const history = useHistory();

    useEffect(() => {
        history.push(`/menuChef/${userId}`);
    }, [history, userId]);

    return null;
};

export default ChefDashboard;
