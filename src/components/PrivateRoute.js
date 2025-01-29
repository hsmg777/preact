import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const isAuthenticated = true; // 🔍 Temporalmente en true para pruebas

    return (
        <Route
            {...rest}
            render={(props) =>
                isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/" /> // Si no está autenticado, vuelve al login
                )
            }
        />
    );
};

export default PrivateRoute; 
