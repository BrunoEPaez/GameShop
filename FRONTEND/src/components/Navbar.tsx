import { Link } from 'react-router-dom';

// Recibe las props desde App.tsx
const Navbar = ({ setShowNavMenu, showNavMenu, menuRef, cartCount, onSearch, searchTerm, user, onLogout }: any) => {
  
  // LÓGICA DE ACCESO TOTAL: 
  // Si el objeto 'user' existe (está logueado), entonces tiene permiso de Admin.
  const hasAdminAccess = user !== null;

  return (
    <nav className="top-nav glass">
      <div className="nav-container">
        
        {/* SECCIÓN IZQUIERDA: LOGO Y EXPLORAR */}
        <div className="nav-left-section">
          <Link to="/" className="nav-logo">GAMER<span>SHOP</span></Link>
          
          <div className="nav-dropdown-wrapper" ref={menuRef}>
            <button className="nav-explore-btn" onClick={() => setShowNavMenu(!showNavMenu)}>
              EXPLORAR ▾
            </button>
            
            {showNavMenu && (
              <div className="nav-mega-menu glass">
                <Link to="/explorar?categoria=CONSOLAS" className="menu-category-item" onClick={() => setShowNavMenu(false)}>CONSOLAS</Link>
                <Link to="/explorar?categoria=PC GAMER" className="menu-category-item" onClick={() => setShowNavMenu(false)}>PC GAMER</Link>
                <Link to="/explorar?categoria=JUEGOS" className="menu-category-item" onClick={() => setShowNavMenu(false)}>JUEGOS</Link>
                <Link to="/explorar?categoria=PERIFÉRICOS" className="menu-category-item" onClick={() => setShowNavMenu(false)}>PERIFÉRICOS</Link>
                <div className="menu-separator"></div>
                <Link to="/explorar?categoria=TODOS" className="menu-category-item special" onClick={() => setShowNavMenu(false)}>VER TODO EL CATÁLOGO</Link>
              </div>
            )}
          </div>
        </div>

        {/* SECCIÓN CENTRAL: BUSCADOR */}
        <div className="nav-search-container">
          <input 
            type="text" 
            placeholder="BUSCAR EQUIPAMIENTO..." 
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="nav-search-input"
          />
        </div>

        {/* SECCIÓN DERECHA: ACCIONES Y ESTADO DE USUARIO */}
        <div className="nav-actions">
          
          {/* BOTÓN ADMIN: Visible para TODO usuario registrado */}
          {hasAdminAccess && (
            <Link 
              to="/admin" 
              className="nav-btn admin-link" 
              style={{ 
                fontWeight: 'bold', 
                color: 'var(--neon-purple)',
                borderColor: 'var(--neon-purple)',
                boxShadow: '0 0 10px rgba(188, 19, 254, 0.3)'
              }}
            >
              MODO_ADMIN
            </Link>
          )}
          
          <Link to="/checkout" className="nav-btn cart-btn">
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span className="cart-badge">{cartCount}</span>
            </div>
          </Link>

          {/* LÓGICA DINÁMICA: USER/SALIR O LOGIN/REGISTRO */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ 
                  color: 'var(--neon-blue)', 
                  fontSize: '10px', 
                  fontFamily: 'Orbitron',
                  display: 'block'
                }}>
                  USUARIO_ACTIVO
                </span>
                <span style={{ fontSize: '11px', color: 'white' }}>
                  {user.email.split('@')[0].toUpperCase()}
                </span>
              </div>
              
              <button 
                onClick={onLogout} 
                className="nav-btn" 
                style={{ borderColor: 'var(--neon-pink)', color: 'var(--neon-pink)' }}
              >
                SALIR
              </button>
            </div>
          ) : (
            <>
              <Link to="/auth?mode=login" className="nav-btn">LOGIN</Link>
              <Link to="/auth?mode=register" className="nav-btn register">REGISTRO</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;