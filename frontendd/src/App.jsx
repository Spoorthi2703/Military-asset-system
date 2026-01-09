function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });

  return (
    <Router>
      <Routes>

        {/* ROOT always goes to LOGIN */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* LOGIN */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login setAuth={setIsAuthenticated} /> : <Navigate to="/dashboard" />} 
        />

        {/* PROTECTED ROUTES */}
        <Route 
          path="/*" 
          element={
            isAuthenticated ? (
              <Layout setIsAuthenticated={setIsAuthenticated}>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/purchases" element={<Purchases />} />
                  <Route path="/transfers" element={<Transfers />} />
                  <Route path="/assignments" element={<Assignments />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
      </Routes>
    </Router>
  );
}
