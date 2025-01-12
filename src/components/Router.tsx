import { Route, Routes, Navigate } from "react-router-dom";
import Home from "pages/home";
import Private from "pages/private";
import LoginPage from "pages/login";
import SignupPage from "pages/signup";
import PublicDetailPage from "pages/home/detail";
import PublicNewPage from "pages/home/new";
import PrivateNewPage from "pages/private/new";
import PrivateDetailPage from "pages/private/detail";



interface RouterProps {
  isAuthenticated: boolean;
}

export default function Router({ isAuthenticated }:RouterProps) {
  
  return (
    <>
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/public" element={<Home />} />
            <Route path="/public/new" element={<PublicNewPage />} />
            <Route path="/public/:id" element={<PublicDetailPage />} />
            <Route
              path="/public/edit/:id"
              element={<h1>Public Edit Page</h1>}
            />
            <Route path="/private" element={<Private />} />
            <Route path="/private/new" element={<PrivateNewPage />} />
            <Route path="/private/:id" element={<PrivateDetailPage/>} />
            <Route
              path="/private/edit/:id"
              element={<h1>Private Edit Page</h1>}
            />
            <Route path="*" element={<Navigate replace to="/" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/public" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </>
        )}
      </Routes>
    </>
  );
}
