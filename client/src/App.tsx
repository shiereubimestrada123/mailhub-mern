import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { AuthPage, EmailPage } from '@/pages';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path='/auth' element={<AuthPage />} />
      <Route path='/email' element={<EmailPage />} />
    </Route>
  )
);

function App() {
  return (
    <div data-theme='light'>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
