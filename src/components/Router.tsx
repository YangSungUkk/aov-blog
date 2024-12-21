import Home from 'pages/home';
import Private from 'pages/private';
import { Route, Routes, Navigate} from 'react-router-dom';

export default function Router() {
  return (    
    <>
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/login' element={<h1>Login</h1>}/>
      <Route path='/public' element={<Home />}/>
      <Route path='/public/new' element={<h1>Public New Page</h1>}/>
      <Route path='/public/:id' element={<h1>Public Detail Page</h1>}/>
      <Route path='/public/edit/:id' element={<h1>Public Edit Page</h1>}/>
      <Route path='/private' element={<Private />}/>      
      <Route path='/private/new' element={<h1>Private New Page</h1>}/>
      <Route path='/private/:id' element={<h1>Private Detail Page</h1>}/>
      <Route path='/private/edit/:id' element={<h1>Private Edit Page</h1>}/>      
      <Route path='*' element={<Navigate replace to="/" />} />
    </Routes>
    </>
  );
}