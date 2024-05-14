import { createBrowserRouter } from 'react-router-dom';
import Home from './routes/home';
import Root from './Root';
import ProductManagement from './routes/modal-router/product-management';
import ProductRegistration from './routes/modal-router/product-registration';
import CategoryRegistration from './routes/modal-router/category-registration';
import CashCheck from './routes/modal-router/cash-check';
import SalesStatistics from './routes/modal-router/sales-statistics';
import CategoryManagement from './routes/modal-router/category-management';
import CreateAccount from './routes/create-account';
import Login from './routes/login';
import ResetPassword from './routes/reset-password';
import ProtectedRoute from './components/protected-route';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '',
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
        children: [
          {
            path: '/product-registration',
            element: <ProductRegistration />,
          },
          {
            path: '/product-management',
            element: <ProductManagement />,
          },
          {
            path: '/category-registration',
            element: <CategoryRegistration />,
          },
          {
            path: '/category-management',
            element: <CategoryManagement />,
          },
          {
            path: '/sales-history',
            element: <CategoryRegistration />,
          },
          {
            path: '/cash-check',
            element: <CashCheck />,
          },
          {
            path: '/sales-statistics',
            element: <SalesStatistics />,
          },
        ],
      },
      {
        path: '/create-account',
        element: <CreateAccount />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/reset-password',
        element: <ResetPassword />,
      },
    ],
  },
]);
