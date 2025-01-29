import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const MesaDashboard = ({ mesaId }) => {
    const history = useHistory();

    useEffect(() => {
        history.push(`/menuUser/${mesaId}`);
    }, [history, mesaId]);

    return null;
};

export default MesaDashboard;
