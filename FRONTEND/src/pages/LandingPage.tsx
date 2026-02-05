import { useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = ({ products, loading, addToCart, cart, isMaintenance }: any) => {  const [categoryFilter, setCategoryFilter] = useState('TODOS');
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  const filtered = products.filter((p: any) => {
    const filtro = categoryFilter.toUpperCase();
    if (filtro === 'TODOS') return true;
    if (filtro === 'OFERTAS') return p.on_sale === true;
    if (filtro === 'NUEVOS PRODUCTOS') {
      if (!p.created_at) return false;
      const fechaCreacion = new Date(p.created_at).getTime();
      const fechaActual = new Date().getTime();
      const diasConfigurados = p.new_until_days || 7; 
      const duracionMilisegundos = diasConfigurados * 24 * 60 * 60 * 1000;
      return (fechaActual - fechaCreacion) < duracionMilisegundos;
    }
    return p.category?.toUpperCase() === filtro;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const displayProducts = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const changeFilter = (cat: string) => {
    setCategoryFilter(cat);
    setPage(1);
  };

  return (
    <main className="main-scrollable">
      <div className="content-wrapper">
        <header className="hero-section">
          <h2 className="glitch">GAMER SHOP</h2>
          <p className="hero-subtitle">EL MEJOR LOOT PARA TU SETUP</p>
        </header>

        <div className="glass filter-container" style={{ display: 'flex', gap: '10px', padding: '15px', marginBottom: '30px', borderRadius: '50px' }}>
          {['TODOS', 'OFERTAS', 'NUEVOS PRODUCTOS'].map(cat => (
            <button key={cat} className={`filter-btn ${categoryFilter === cat ? 'active' : ''}`} onClick={() => changeFilter(cat)}>
              {cat}
            </button>
          ))}
        </div>

        <div className="items-grid">
          {loading ? (
            <h2 className="loading-text">ACCEDIENDO AL SISTEMA...</h2>
          ) : displayProducts.length > 0 ? (
            displayProducts.map((p: any) => {
              const discount = p.discount_percentage || 0;
              const finalPrice = p.on_sale ? p.price - (p.price * discount / 100) : p.price;
              
              const itemEnCarrito = cart?.find((item: any) => item.id === p.id);
              const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.quantity : 0;
              const sinStockReal = p.stock <= 0;
              const limiteAlcanzado = cantidadEnCarrito >= p.stock;

              return (
                <div key={p.id} className="gamer-card">
                  <div className="price-container">
                    {p.on_sale ? (
                      <>
                        <span className="old-price">${p.price}</span>
                        <span className="current-price">${finalPrice.toFixed(0)}</span>
                        <div className="discount-badge">-{discount}%</div>
                      </>
                    ) : (
                      <span className="current-price">${p.price}</span>
                    )}
                  </div>
                  <Link to={`/producto/${p.id}`} className="image-container">
                    <img src={p.image_url} alt={p.name} />
                  </Link>
                  <h3>{p.name}</h3>
                  <p className="company">{p.category || 'GEAR'}</p>
                  <button 
  className="buy-button" 
  onClick={() => !limiteAlcanzado && addToCart(p)}
  // AGREGAMOS LA CONDICIÓN DE MANTENIMIENTO AQUÍ:
  disabled={sinStockReal || limiteAlcanzado || isMaintenance}
  style={(sinStockReal || limiteAlcanzado || isMaintenance) ? { 
    opacity: 0.5, 
    cursor: 'not-allowed', 
    filter: 'grayscale(1)' 
  } : {}}
>
  {isMaintenance ? 'TIENDA EN PAUSA' : sinStockReal ? 'SIN STOCK' : 'ADQUIRIR'}
</button>
                </div>
              );
            })
          ) : (
            <div style={{textAlign: 'center', gridColumn: '1/-1', marginTop: '50px'}}>
              <h2 className="loading-text">SIN REGISTROS EN ESTA CATEGORÍA</h2>
            </div>
          )}
        </div>

        {!loading && totalPages > 1 && (
          <div className="pagination" style={{ marginTop: '50px', display: 'flex', gap: '20px', alignItems: 'center' }}>
            <button className="filter-btn" disabled={page === 1} onClick={() => { setPage(page - 1); window.scrollTo(0,0); }}>ATRÁS</button>
            <span style={{fontFamily: 'Press Start 2P', fontSize: '10px', color: 'white'}}>{page} / {totalPages}</span>
            <button className="filter-btn" disabled={page >= totalPages} onClick={() => { setPage(page + 1); window.scrollTo(0,0); }}>SIGUIENTE</button>
          </div>
        )}
      </div>
    </main>
  );
};

export default LandingPage;