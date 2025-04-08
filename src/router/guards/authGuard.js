import { auth } from '@/config/firebase';

export const authGuard = (to, from, next) => {
  const user = auth.currentUser;

  // Protect all routes except login and register
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);

  if (authRequired && !user) {
    // If user tries to access protected route without auth
    next('/login');
    return;
  }

  // If authenticated user tries to access login/register
  if (user && publicPages.includes(to.path)) {
    next('/');
    return;
  }

  next();
};
