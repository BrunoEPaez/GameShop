import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetail = ({ products, addToCart, isMaintenance }: any) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p: any) => p.id === Number(id));

  const [displayImage, setDisplayImage] = useState<string | null>(null);

  if (!product) return <div style={{marginTop: '150px', textAlign: 'center'}} className="glitch">PRODUCTO NO ENCONTRADO</div>;

  const mainImg = displayImage || product.image_url;

  const basePrice = Number(product.price) || 0;
  const discount = Number(product.discount_percentage) || 0;
  
  const finalPrice = product.on_sale 
    ? basePrice - (basePrice * (discount / 100)) 
    : basePrice;

  // --- FUNCIÓN DE LIMPIEZA TOTAL ---
  const formatSubCategory = (text: string) => {
    if (!text) return '';
    
    // Esta regex elimina "DETECCION_GÉNERO", "SUB_SECTOR", "DATA_STREAM" y cualquier símbolo > o /
    // que haya podido quedar guardado en la base de datos por error.
    let cleanText = text
      .replace(/>/g, '')
      .replace(/\//g, '')
      .replace(/SUB_SECTOR:/g, '')
      .replace(/DATA_STREAM/g, '')
      .replace(/DETECCION_GÉNERO/g, '')
      .replace(/DETECCION_GENERO/g, '')
      .trim();
    
    // Convierte "pelea, accion" en "PELEA • ACCION"
    return cleanText.split(',').map(item => item.trim()).join(' • ');
  };

  return (
    <div className="product-detail-container" style={{ paddingTop: '120px', minHeight: '100vh', paddingBottom: '50px' }}>
      <div className="detail-grid glass" style={{ display: 'flex', gap: '40px', maxWidth: '1200px', margin: '0 auto', padding: '40px', border: '1px solid rgba(0, 210, 255, 0.1)' }}>
        
        {/* LADO IZQUIERDO: VISUALES */}
        <div style={{ flex: 1 }}>
          <div className="main-frame glass" style={{ border: '2px solid var(--neon-blue)', marginBottom: '20px', borderRadius: '8px', overflow: 'hidden', background: 'rgba(0,0,0,0.4)' }}>
            <img src={mainImg} alt={product.name} style={{ width: '100%', height: '500px', objectFit: 'contain', padding: '20px' }} />
          </div>
          
          <div className="gallery-carousel" style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'thin' }}>
            <img 
              src={product.image_url} 
              className="gallery-thumb glass" 
              style={{ width: '90px', height: '70px', objectFit: 'cover', cursor: 'pointer', border: mainImg === product.image_url ? '2px solid var(--neon-blue)' : '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', transition: '0.3s' }}
              onClick={() => setDisplayImage(product.image_url)}
              alt="principal thumb"
            />
            {product.gallery_urls?.map((url: string, idx: number) => (
              <img 
                key={idx} 
                src={url} 
                className="gallery-thumb glass" 
                style={{ width: '90px', height: '70px', objectFit: 'cover', cursor: 'pointer', border: mainImg === url ? '2px solid var(--neon-blue)' : '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', transition: '0.3s' }}
                onClick={() => setDisplayImage(url)}
                alt={`gallery thumb ${idx}`}
              />
            ))}
          </div>
        </div>

        {/* LADO DERECHO: INFO */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <span className="category-label" style={{ letterSpacing: '3px', color: 'var(--neon-pink)', fontWeight: 'bold', fontSize: '14px' }}>
              {product.category || 'GAMER_GEAR'}
            </span>
          </div>

          <h1 className="glitch" style={{ fontSize: '2.8rem', margin: '15px 0', textTransform: 'uppercase' }}>{product.name}</h1>
          
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '25px' }}>
            {product.on_sale && (
              <span style={{ textDecoration: 'line-through', color: 'rgba(255,255,255,0.3)', fontSize: '1.2rem', fontFamily: 'Orbitron' }}>
                ${basePrice}
              </span>
            )}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px' }}>
              <span style={{ color: 'var(--neon-green)', fontSize: '2.5rem', fontFamily: 'Orbitron' }}>
                ${finalPrice.toFixed(0)}
              </span>
              {product.on_sale && (
                <span style={{ color: 'var(--neon-pink)', fontSize: '0.9rem', border: '1px solid var(--neon-pink)', padding: '2px 8px', borderRadius: '4px' }}>
                  -{discount}% OFF
                </span>
              )}
            </div>
          </div>

          {/* ETIQUETA DE GÉNERO SIMPLIFICADA */}
          {product.secondary_category && (
            <div style={{ 
              marginBottom: '15px', 
              padding: '8px 0', 
              borderTop: '1px solid rgba(180, 0, 255, 0.2)',
              borderBottom: '1px solid rgba(180, 0, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ color: 'var(--neon-purple)', fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px' }}>
                GÉNERO //
              </span>
              <span style={{ 
                color: '#efefef', 
                fontFamily: 'Rajdhani', 
                fontWeight: '600', 
                fontSize: '15px', 
                textTransform: 'uppercase'
              }}>
                {formatSubCategory(product.secondary_category)}
              </span>
            </div>
          )}
          
          <p className="description" style={{ lineHeight: '1.8', color: '#bbb', marginBottom: '30px', background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '5px' }}>
            {product.description || "Este equipamiento de alta gama no tiene especificaciones cargadas aún."}
          </p>

          <div className="specs-box glass" style={{ padding: '20px', marginBottom: '30px', borderLeft: '4px solid var(--neon-blue)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', color: '#888' }}>DISPONIBILIDAD:</span>
              <span style={{ color: product.stock > 0 ? 'var(--neon-blue)' : 'var(--neon-pink)', fontFamily: 'Orbitron', fontSize: '12px' }}>
                {product.stock > 0 ? `${product.stock} UNIDADES EN NÚCLEO` : 'AGOTADO EN SECTOR'}
              </span>
            </div>
          </div>

          <button 
  className="buy-button glass large" 
  style={{ 
    width: '100%', 
    padding: '20px', 
    fontSize: '1.2rem', 
    opacity: (product.stock <= 0 || isMaintenance) ? 0.5 : 1,
    cursor: (product.stock <= 0 || isMaintenance) ? 'not-allowed' : 'pointer'
  }}
  disabled={product.stock <= 0 || isMaintenance}
  onClick={() => !isMaintenance && addToCart(product)}
>
  {isMaintenance 
    ? '[!] SISTEMA EN PAUSA' 
    : product.stock > 0 ? 'ADQUIRIR EQUIPAMIENTO' : 'FUERA DE STOCK'}
</button>
          
          <button className="back-link" style={{ background: 'none', border: 'none', color: '#444', marginTop: 'auto', cursor: 'pointer', textAlign: 'left', fontSize: '12px' }} onClick={() => navigate(-1)}>
            [←] REGRESAR AL SECTOR DE EXPLORACIÓN
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;