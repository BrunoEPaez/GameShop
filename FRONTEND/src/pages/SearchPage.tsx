import { Link, useNavigate } from 'react-router-dom';

const SearchPage = ({ products, searchTerm, addToCart, isMaintenance }: any) => {  
const navigate = useNavigate();
  
  // Filtrado de resultados
  const results = products.filter((p: any) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <main className="main-scrollable">
      <div className="content-wrapper">
        <header className="search-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <button 
            className="filter-btn" 
            onClick={() => navigate('/')}
            style={{ marginBottom: '20px' }}
          >
            ⬅ VOLVER AL INICIO
          </button>
          <h2 className="glitch-small" style={{ fontSize: '2.5rem', textTransform: 'uppercase' }}>
            RESULTADOS PARA: "{searchTerm.toUpperCase()}"
          </h2>
          <p className="hero-subtitle" style={{ color: 'var(--neon-green)', fontFamily: 'Press Start 2P', fontSize: '12px' }}>
            {results.length} OBJETOS ENCONTRADOS EN EL SECTOR
          </p>
        </header>

        <div className="items-grid">
          {results.length > 0 ? (
            results.map((p: any) => {
              // Lógica de precios idéntica a LandingPage
              const discount = Number(p.discount_percentage) || 0;
              const basePrice = Number(p.price) || 0;
              const finalPrice = p.on_sale 
                ? basePrice - (basePrice * (discount / 100)) 
                : basePrice;

              return (
                <div key={p.id} className="gamer-card">
                  {/* Contenedor de Precios (Estilo Landing) */}
                  <div className="price-container">
                    {p.on_sale ? (
                      <>
                        <span className="old-price">${basePrice}</span>
                        <span className="current-price">${finalPrice.toFixed(0)}</span>
                        <div className="discount-badge">-{discount}%</div>
                      </>
                    ) : (
                      <span className="current-price">${basePrice}</span>
                    )}
                  </div>

                  {/* Imagen del Producto */}
                  <Link to={`/producto/${p.id}`} className="image-container">
                    <img src={p.image_url} alt={p.name} />
                  </Link>

                  {/* Información del Producto */}
                  <h3>{p.name}</h3>
                  <p className="company">{p.category || 'GEAR'}</p>
                  
                  {/* Botón de Compra */}
                  <button 
  className="buy-button" 
  onClick={() => !isMaintenance && addToCart(p)}
  disabled={isMaintenance}
  style={isMaintenance ? { opacity: 0.5, cursor: 'not-allowed', filter: 'grayscale(1)' } : {}}
>
  {isMaintenance ? 'PAUSADO' : 'ADQUIRIR'}
</button>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', gridColumn: '1/-1', marginTop: '50px' }}>
              <h2 className="loading-text" style={{ marginBottom: '30px' }}>
                SIN RESULTADOS EN LA BASE DE DATOS
              </h2>
              <button className="filter-btn" onClick={() => navigate('/')}>
                VER TODO EL CATÁLOGO
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default SearchPage;