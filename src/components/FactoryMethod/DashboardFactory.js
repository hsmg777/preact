class DashboardFactory {
    static getDashboard(isAdmin, userId, mesaId) {
        if (isAdmin === "Y") {
            return "/Menu"; // Ruta para Administrador
        } else if (isAdmin === "N") {
            return `/menuChef/${userId}`; // Ruta para Chef con ID
        } else if (mesaId) {
            return `/menuUser/${mesaId}`; // Ruta para Mesa con ID
        }
        return null; // Si no es un rol válido, devuelve null
    }
}

export default DashboardFactory;
