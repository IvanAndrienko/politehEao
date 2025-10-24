import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminNews from "./pages/admin/AdminNews";
import AdminFiles from "./pages/admin/AdminFiles";
import AdminAdmission from "./pages/admin/AdminAdmission";
import AdminRaspisanie from "./pages/admin/AdminRaspisanie";
import AdminAnons from "./pages/admin/AdminAnons";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminHome from "./pages/admin/AdminHome";
import NewsList from "./pages/NewsList";
import NewsDetail from "./pages/NewsDetail";
import Home from "./pages/Home";
import Admission from "./pages/Admission";
import Students from "./pages/Students";
import Anons from "./pages/Anons";
import Raspisanie from "./pages/Raspisanie";
import GroupRaspisanie from "./pages/GroupRaspisanie";
import Sveden from "./pages/Sveden";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <main className="flex-1">
                <Home />
              </main>
              <Footer />
            </>
          } />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute>
              <AdminSettings />
            </ProtectedRoute>
          } />
          <Route path="/admin/news" element={
            <ProtectedRoute>
              <AdminNews />
            </ProtectedRoute>
          } />
          <Route path="/admin/files" element={
            <ProtectedRoute>
              <AdminFiles />
            </ProtectedRoute>
          } />
          <Route path="/admin/admission" element={
            <ProtectedRoute>
              <AdminAdmission />
            </ProtectedRoute>
          } />
          <Route path="/admin/raspisanie" element={
            <ProtectedRoute>
              <AdminRaspisanie />
            </ProtectedRoute>
          } />
          <Route path="/admin/anons" element={
            <ProtectedRoute>
              <AdminAnons />
            </ProtectedRoute>
          } />
          <Route path="/admin/students" element={
            <ProtectedRoute>
              <AdminStudents />
            </ProtectedRoute>
          } />
          <Route path="/admin/home" element={
            <ProtectedRoute>
              <AdminHome />
            </ProtectedRoute>
          } />
          <Route path="/news" element={
            <>
              <Header />
              <main className="flex-1">
                <div className="max-w-screen-2xl mx-auto py-6 sm:px-3 lg:px-4">
                  <NewsList />
                </div>
              </main>
              <Footer />
            </>
          } />
          <Route path="/news/:slug" element={
            <>
              <Header />
              <main className="flex-1">
                <div className="max-w-screen-2xl mx-auto py-6 sm:px-3 lg:px-4">
                  <NewsDetail />
                </div>
              </main>
              <Footer />
            </>
          } />
          <Route path="/admission" element={
            <>
              <Header />
              <main className="flex-1">
                  <Admission />
              </main>
              <Footer />
            </>
          } />
          <Route path="/students" element={
            <>
              <Header />
              <main className="flex-1">
                <Students />
              </main>
              <Footer />
            </>
          } />
          <Route path="/students/anons" element={
            <>
              <Header />
              <main className="flex-1">
                <Anons />
              </main>
              <Footer />
            </>
          } />
          <Route path="/students/raspisanie" element={
            <>
              <Header />
              <main className="flex-1">
                <Raspisanie />
              </main>
              <Footer />
            </>
          } />
          <Route path="/students/raspisanie/:groupCode" element={
            <>
              <Header />
              <main className="flex-1">
                <GroupRaspisanie />
              </main>
              <Footer />
            </>
          } />
          <Route path="/sveden" element={
            <>
              <Header />
              <main className="flex-1">
                <Sveden />
              </main>
              <Footer />
            </>
          } />
          <Route path="/sveden/:section" element={
            <>
              <Header />
              <main className="flex-1">
                <Sveden />
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
