import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = ({ products, isMaintenance, setIsMaintenance }: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // --- NUEVO ESTADO PARA VENTAS ---
  const [sales, setSales] = useState<any[]>([]);
  
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    category: 'JUEGOS',
    secondary_category: '',
    on_sale: false,
    discount_percentage: 0,
    new_until_days: 7 
  });

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<FileList | null>(null);

  const categoriasDisponibles = ['JUEGOS', 'CONSOLAS', 'PC GAMER', 'PERIFÉRICOS', 'COMPONENTES'];

  // Función para formatear moneda (Argentina)
  const formatCurrency = (amount: number | string) => {
  return new Number(amount).toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2, // Fuerza los ,00 finales
    maximumFractionDigits: 2
  });
};

  // --- NUEVO: CARGAR VENTAS AL INICIAR ---
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axios.get('https://gameshopterminado.onrender.com/api/sales');
        setSales(res.data);
      } catch (e) {
        console.error("Error cargando ventas", e);
      }
    };
    fetchSales();
  }, []);

  const prepareEdit = (p: any) => {
    setIsEditing(true);
    setEditingId(p.id);
    setProductData({
      name: p.name,
      price: p.price,
      stock: p.stock || 0,
      description: p.description || '',
      category: p.category ? p.category.toUpperCase() : 'JUEGOS',
      secondary_category: p.secondary_category || '',
      on_sale: p.on_sale || false,
      discount_percentage: p.discount_percentage || 0,
      new_until_days: p.new_until_days || 7
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setProductData({ 
      name: '', price: '', stock: '', description: '', 
      category: 'JUEGOS', secondary_category: '', 
      on_sale: false, discount_percentage: 0, new_until_days: 7 
    });
    setMainImage(null);
    setGalleryImages(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('product[name]', productData.name);
    formData.append('product[price]', productData.price);
    formData.append('product[stock]', productData.stock);
    formData.append('product[description]', productData.description);
    formData.append('product[category]', productData.category);
    formData.append('product[secondary_category]', productData.secondary_category);
    formData.append('product[on_sale]', String(productData.on_sale));
    formData.append('product[discount_percentage]', String(productData.discount_percentage));
    formData.append('product[new_until_days]', String(productData.new_until_days)); 
    
    if (mainImage) formData.append('product[image]', mainImage);
    if (galleryImages) {
      Array.from(galleryImages).forEach((file) => {
        formData.append('product[gallery_images][]', file);
      });
    }

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (isEditing && editingId) {
        await axios.patch(`https://gameshopterminado.onrender.com/api/products/${editingId}`, formData, config);
        alert("NÚCLEO ACTUALIZADO CORRECTAMENTE");
      } else {
        await axios.post('https://gameshopterminado.onrender.com/api/products', formData, config);
        alert("NUEVO ÍTEM SINCRONIZADO");
      }
      window.location.reload();
    } catch (error) {
      alert("ERROR EN LA OPERACIÓN");
    }
  };

  const toggleMaintenance = async () => {
    const nuevoEstado = !isMaintenance;
    try {
      await axios.patch(`https://gameshopterminado.onrender.com/api/settings/maintenance_mode`, {
        value: nuevoEstado
      });
      setIsMaintenance(nuevoEstado);
    } catch (e) {
      alert("Error al conectar con el servidor para cambiar el estado");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿ELIMINAR PRODUCTO DEL NÚCLEO?")) {
      try {
        await axios.delete(`https://gameshopterminado.onrender.com/api/products/${id}`);
        window.location.reload();
      } catch (error) {
        alert("ERROR AL ELIMINAR");
      }
    }
  };

  const sortedProducts = [...products].sort((a: any, b: any) => b.id - a.id);
  const filteredProducts = sortedProducts.filter((p: any) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toString() === searchTerm
  );
  
  const indexOfLastProduct = currentPage * productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfLastProduct - productsPerPage, indexOfLastProduct);

  return (
    <div className="admin-container glass" style={{ marginTop: '120px', padding: '40px', maxWidth: '1200px', margin: '120px auto', minHeight: '80vh' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid var(--neon-blue)', paddingBottom: '20px' }}>
        <h2 className="glitch-small" style={{ fontSize: '1.5rem' }}>CENTRAL_INVENTARIO</h2>
        <div className="nav-search-container" style={{ width: '350px' }}>
          <input type="text" placeholder="BUSCAR POR ID O NOMBRE..." className="nav-search-input" style={{ width: '100%' }} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass" style={{ padding: '25px', marginBottom: '40px', display: 'grid', gap: '15px', gridTemplateColumns: '1fr 1fr', border: isEditing ? '2px solid var(--neon-pink)' : '1px solid rgba(0, 210, 255, 0.2)' }}>
        <h3 style={{ gridColumn: 'span 2', color: isEditing ? 'var(--neon-pink)' : 'var(--neon-blue)', fontFamily: 'Orbitron', fontSize: '14px', marginBottom: '10px' }}>
          {isEditing ? `[!] MODIFICANDO PRODUCTO #${editingId}` : '[+] REGISTRAR NUEVO SUMINISTRO'}
        </h3>
        
        <input type="text" placeholder="NOMBRE DEL DISPOSITIVO" value={productData.name} onChange={e => setProductData({...productData, name: e.target.value})} className="admin-input" required />
        
        <select value={productData.category} onChange={e => setProductData({...productData, category: e.target.value})} className="admin-input" style={{ background: '#050110', color: 'white' }}>
          {categoriasDisponibles.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <input type="number" placeholder="PRECIO CRÉDITOS" value={productData.price} onChange={e => setProductData({...productData, price: e.target.value})} className="admin-input" required />
        <input type="number" placeholder="STOCK INICIAL" value={productData.stock} onChange={e => setProductData({...productData, stock: e.target.value})} className="admin-input" required />
        
        <input 
          type="text" 
          placeholder="GÉNERO / CATEGORÍA SECUNDARIA" 
          value={productData.secondary_category} 
          onChange={e => setProductData({...productData, secondary_category: e.target.value.toUpperCase()})} 
          className="admin-input" 
          style={{ gridColumn: 'span 1', borderColor: 'var(--neon-purple)' }}
        />

        <div style={{ gridColumn: 'span 1', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ color: 'var(--neon-blue)', fontSize: '10px', fontFamily: 'Orbitron' }}>DURACIÓN ESTADO NUEVO:</label>
          <select 
            value={productData.new_until_days} 
            onChange={e => setProductData({...productData, new_until_days: parseInt(e.target.value)})}
            className="admin-input"
            style={{ background: '#050110', color: 'white' }}
          >
            <option value={1}>1 DÍA</option>
            <option value={3}>3 DÍAS</option>
            <option value={7}>7 DÍAS</option>
            <option value={15}>15 DÍAS</option>
            <option value={30}>30 DÍAS</option>
          </select>
        </div>

        <div className="glass" style={{ gridColumn: 'span 2', padding: '15px', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <label style={{ color: 'var(--neon-green)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input type="checkbox" checked={productData.on_sale} onChange={e => setProductData({...productData, on_sale: e.target.checked})} /> ¿ACTIVAR OFERTA?
          </label>
          {productData.on_sale && (
            <input type="number" placeholder="% DESCUENTO" value={productData.discount_percentage} onChange={e => setProductData({...productData, discount_percentage: parseInt(e.target.value)})} className="admin-input" style={{ width: '150px' }} />
          )}
        </div>

        <textarea placeholder="ESPECIFICACIONES TÉCNICAS..." style={{ gridColumn: 'span 2', minHeight: '80px' }} value={productData.description} onChange={e => setProductData({...productData, description: e.target.value})} className="admin-input" />
        
        <div style={{ gridColumn: 'span 1' }}>
          <label style={{ color: 'var(--neon-blue)', fontSize: '10px', display: 'block', marginBottom: '5px' }}>FOTO DE TAPA (PRINCIPAL)</label>
          <input type="file" onChange={e => setMainImage(e.target.files![0])} className="admin-input" style={{ width: '100%' }} />
        </div>

        <div style={{ gridColumn: 'span 1' }}>
          <label style={{ color: 'var(--neon-purple)', fontSize: '10px', display: 'block', marginBottom: '5px' }}>FOTOS SECUNDARIAS (GALERÍA)</label>
          <input type="file" multiple onChange={e => setGalleryImages(e.target.files)} className="admin-input" style={{ width: '100%' }} />
        </div>
        
        <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
          <button type="submit" className="buy-button glass" style={{ flex: 2 }}>
            {isEditing ? 'ACTUALIZAR REGISTRO' : 'EJECUTAR CARGA DE DATOS'}
          </button>
          {isEditing && (
            <button type="button" onClick={handleCancelEdit} className="buy-button glass" style={{ flex: 1, borderColor: 'var(--neon-pink)', color: 'var(--neon-pink)' }}>
              CANCELAR
            </button>
          )}
        </div>
      </form>

      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>IMG</th>
              <th>NOMBRE</th>
              <th>CATEGORÍA</th>
              <th>PRECIO</th>
              <th>STOCK</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((p: any) => (
              <tr key={p.id}>
                <td style={{ color: 'var(--neon-blue)', fontSize: '11px', fontFamily: 'Orbitron' }}>#{p.id}</td>
                <td>
                  <img src={p.image_url} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                </td>
                <td style={{ fontSize: '14px', fontFamily: 'Orbitron' }}>{p.name}</td>
                <td style={{ fontSize: '12px' }}>{p.category}</td>
                <td style={{ color: 'var(--neon-green)', fontWeight: 'bold' }}>
                  {p.on_sale ? (
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                      <span style={{textDecoration: 'line-through', color: 'gray', fontSize: '10px'}}>{formatCurrency(p.price)}</span>
                      <span>{formatCurrency(Number(p.price) * (1 - Number(p.discount_percentage)/100))}</span>
                    </div>
                  ) : (
                    formatCurrency(p.price)
                  )}
                </td>
                <td style={{ 
                  fontSize: '13px', 
                  color: Number(p.stock) <= 3 ? 'var(--neon-pink)' : 'white',
                  fontWeight: Number(p.stock) <= 3 ? 'bold' : 'normal'
                }}>
                  {p.stock}
                  {Number(p.stock) <= 3 && <span style={{fontSize: '9px', marginLeft: '5px'}}>⚠️ LOW</span>}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button className="nav-btn" style={{ fontSize: '9px', padding: '5px 10px' }} onClick={() => prepareEdit(p)}>MODIFICAR</button>
                    <button className="nav-btn register" style={{ fontSize: '9px', padding: '5px 10px' }} onClick={() => handleDelete(p.id)}>ELIMINAR</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '30px' }}>
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="nav-btn" style={{ opacity: currentPage === 1 ? 0.5 : 1 }}>PREV</button>
        <span style={{ color: 'var(--neon-blue)', fontFamily: 'Orbitron', fontSize: '10px' }}>PÁGINA {currentPage}</span>
        <button disabled={indexOfLastProduct >= filteredProducts.length} onClick={() => setCurrentPage(prev => prev + 1)} className="nav-btn" style={{ opacity: indexOfLastProduct >= filteredProducts.length ? 0.5 : 1 }}>NEXT</button>
      </div>

      {/* --- NUEVA SECCIÓN: HISTORIAL DE VENTAS --- */}
      <div style={{ marginTop: '80px', borderTop: '1px solid var(--neon-purple)', paddingTop: '40px' }}>
        <h2 className="glitch-small" style={{ fontSize: '1.5rem', color: 'var(--neon-purple)', marginBottom: '20px' }}>ÚLTIMAS_VENTAS_MP</h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>FECHA</th>
                <th>TRANSACCIÓN</th>
                <th>PRODUCTOS</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {sales.length > 0 ? sales.map((sale: any) => (
                <tr key={sale.id}>
                  <td style={{ fontSize: '11px' }}>{new Date(sale.created_at).toLocaleString()}</td>
                  <td style={{ color: 'var(--neon-blue)', fontSize: '11px', fontFamily: 'monospace' }}>{sale.transaction_id}</td>
                  <td style={{ fontSize: '12px', textAlign: 'left', maxWidth: '300px' }}>{sale.items_description}</td>
                  <td style={{ color: 'var(--neon-green)', fontWeight: 'bold' }}>{formatCurrency(sale.total_price)}</td>
                </tr>
              )) : (
                <tr><td colSpan={4} style={{ padding: '20px', color: 'gray' }}>NO SE DETECTARON REGISTROS DE VENTA</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ 
          marginTop: '40px', 
          padding: '20px', 
          border: isMaintenance ? '2px solid var(--neon-pink)' : '2px solid var(--neon-purple)',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: isMaintenance ? '0 0 15px rgba(255, 0, 255, 0.2)' : 'none'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <h2 className="glitch-small" style={{ 
              fontSize: '1rem', 
              color: isMaintenance ? 'var(--neon-pink)' : 'var(--neon-blue)', 
              margin: 0,
              letterSpacing: '2px'
            }}>
              SISTEMA_STATUS: {isMaintenance ? ':: PAUSADO' : ':: OPERATIVO'}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', margin: 0, textTransform: 'uppercase' }}>
              {isMaintenance 
                ? 'El flujo de transacciones está detenido actualmente.' 
                : 'Todos los sistemas están funcionando con normalidad.'}
            </p>
          </div>
          
          <button 
            className="buy-button" 
            onClick={toggleMaintenance}
            style={{ 
              padding: '8px 40px', 
              minWidth: '220px',
              fontSize: '0.9rem',
              height: 'fit-content'
            }}
          >
            {isMaintenance ? 'RE-ESTABLECER CONEXIÓN' : 'DESCONECTAR TIENDA (VACACIONES)'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;