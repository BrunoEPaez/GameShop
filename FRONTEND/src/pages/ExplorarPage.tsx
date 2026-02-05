import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// IMPORTACIÓN DEL CSS
import '../ExplorarPage.css'; 

const ExplorarPage = ({ products, addToCart, cart, isMaintenance }: any) => {
  const location = useLocation(); 
  const [category, setCategory] = useState('TODOS');
  const [sort, setSort] = useState('default');
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryFromUrl = queryParams.get('categoria') || 'TODOS';
    setCategory(categoryFromUrl.toUpperCase());
    setPage(1);
  }, [location.search]);

  // Filtrado incluyendo Ofertas
  let filtered = (products || []).filter((p: any) => {
    const productCat = p.category ? p.category.toUpperCase() : "";
    if (category === 'TODOS') return true;
    if (category === 'OFERTAS') return p.on_sale === true;
    return productCat === category;
  });
  
  // Ordenamiento por precio real
  if (sort === 'low') {
    filtered.sort((a: any, b: any) => {
      const pA = a.on_sale ? (a.price * (1 - a.discount_percentage / 100)) : a.price;
      const pB = b.on_sale ? (b.price * (1 - b.discount_percentage / 100)) : b.price;
      return pA - pB;
    });
  }
  if (sort === 'high') {
    filtered.sort((a: any, b: any) => {
      const pA = a.on_sale ? (a.price * (1 - a.discount_percentage / 100)) : a.price;
      const pB = b.on_sale ? (b.price * (1 - b.discount_percentage / 100)) : b.price;
      return pB - pA;
    });
  }

  const displayProducts = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="explore-layout" style={{ minHeight: '100vh' }}>
      
      <aside className="filters-sidebar glass">
        <div className="filter-group">
          <label className="sidebar-title">CATEGORÍAS</label>
          {['TODOS', 'OFERTAS', 'JUEGOS', 'CONSOLAS', 'PC GAMER', 'PERIFÉRICOS'].map(cat => (
            <button 
              key={cat} 
              className={category === cat ? 'active' : ''} 
              onClick={() => { setCategory(cat); setPage(1); }}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="filter-group">
          <label className="sidebar-title">ORDENAR POR</label>
          <select onChange={(e) => setSort(e.target.value)} className="gamer-select-small">
            <option value="default">RELEVANCIA</option>
            <option value="low">MENOR PRECIO</option>
            <option value="high">MAYOR PRECIO</option>
          </select>
        </div>
      </aside>

      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div className="items-grid">
          {displayProducts.length > 0 ? (
            displayProducts.map((p: any) => {
              const sinStockReal = Number(p.stock) <= 0;
              
              // Buscamos si el producto ya está en el carrito para saber cuántos hay
              const itemEnCarrito = cart?.find((item: any) => item.id === p.id);
              const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.quantity : 0;
              
              // El límite real es el stock del producto
              const stockAgotado = cantidadEnCarrito >= Number(p.stock);

              return (
                <div key={p.id} className="gamer-card">
                  <div className="price-tag-container">
                    {p.on_sale && <span className="sale-badge-mini">-{p.discount_percentage}%</span>}
                    <div className="price-stack">
                      {p.on_sale ? (
                        <>
                          <span className="old-price-mini">${Number(p.price).toLocaleString('es-AR')}</span>
                          <span className="current-price-mini">
                            ${(p.price * (1 - p.discount_percentage / 100)).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                          </span>
                        </>
                      ) : (
                        <span className="current-price-mini">${Number(p.price).toLocaleString('es-AR')}</span>
                      )}
                    </div>
                  </div>

                  <Link to={`/producto/${p.id}`} className="image-container">
                    <img src={p.image_url} alt={p.name} />
                  </Link>

                  <h3>{p.name}</h3>
                  <p className="company">{p.category || 'GEAR'}</p>
                  
                  <button 
                    className="buy-button" 
                    onClick={() => !stockAgotado && addToCart(p)}
                    disabled={sinStockReal || stockAgotado || isMaintenance} 
                    style={(sinStockReal || stockAgotado || isMaintenance) ? { 
                      opacity: 0.5, 
                      cursor: 'not-allowed', 
                      filter: 'grayscale(1)' 
                    } : {}}
                  >
                    {isMaintenance 
                      ? 'PAUSADO' 
                      : sinStockReal 
                        ? 'SIN STOCK' 
                        : stockAgotado 
                          ? 'MÁX. ALCANZADO' 
                          : 'ADQUIRIR'}
                  </button>
                  
                  {cantidadEnCarrito > 0 && (
                    <span style={{ fontSize: '10px', color: 'var(--neon-blue)', marginTop: '5px' }}>
                      EN CARRITO: {cantidadEnCarrito}
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <div className="no-results" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px 0' }}>
              <h2 className="loading-text" style={{ fontFamily: 'Orbitron', color: 'var(--neon-blue)' }}>
                NO SE ENCONTRARON PRODUCTOS
              </h2>
            </div>
          )}
        </div>
        
        {filtered.length > itemsPerPage && (
          <div className="pagination" style={{ marginTop: 'auto', paddingTop: '50px' }}>
            <button className="filter-btn" disabled={page === 1} onClick={() => {setPage(page - 1); window.scrollTo(0,0)}}>ATRÁS</button>
            <span className="page-indicator">{page} / {totalPages || 1}</span>
            <button className="filter-btn" disabled={page >= totalPages} onClick={() => {setPage(page + 1); window.scrollTo(0,0)}}>SIGUIENTE</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorarPage;