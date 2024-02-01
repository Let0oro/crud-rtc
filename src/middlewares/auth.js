export function authenticateMiddleware(req, res, next) {
    // revisa si hay usuario registrado  
    if (!req.user) {
        // Si no lo hay, manda a iniciar sesión
      return res.redirect('/login');
    }
    // Si lo hay, continúa
    next();
}