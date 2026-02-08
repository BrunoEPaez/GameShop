import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CheckoutPage = ({ cart, removeFromCart, clearCart, fetchProducts }: any) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  
  const total = cart.reduce((acc: number, item: any) => {
    const basePrice = Number(item.price) || 0;
    const discount = Number(item.discount_percentage) || 0;
    const quantity = Number(item.quantity) || 1;
    const precioFinal = item.on_sale ? basePrice * (1 - discount / 100) : basePrice;
    return acc + (precioFinal * quantity);
  }, 0);

  const procesarCompra = async (metodo: 'MP' | 'WA') => {
    setIsProcessing(true);

    try {
      if (metodo === 'MP') {
        // --- LLAMADA SEGURA AL BACKEND (DESCUENTA STOCK Y REGISTRA VENTA) ---
        await axios.post('https://gameshopterminado.onrender.com/api/checkout', { cart });

        if (fetchProducts) await fetchProducts(); 
        
        clearCart();
        navigate('/success'); 

      } else {
        // --- LÓGICA DE WHATSAPP ---
        const telefono = "5493794123456"; 
        let mensaje = `*CONSULTA DE COMPRA - GAMER SHOP*%0A%0A`;
        cart.forEach((item: any) => {
          mensaje += `• ${item.name} (x${item.quantity})%0A`;
        });
        mensaje += `%0A*Total Estimado: $${total.toFixed(2)}*`;
        
        // 1. Abrimos WhatsApp en nueva pestaña
        window.open(`https://wa.me/${telefono}?text=${mensaje}`, '_blank');

        // 2. Limpiamos el carrito inmediatamente para que no queden productos viejos
        clearCart();

        // 3. Redirigimos a una página de "Pedido Enviado" o al inicio con un mensaje
        alert("REDIRIGIENDO A WHATSAPP... TU CARRITO SE HA LIMPIADO.");
        navigate('/explorar'); 
      }
    } catch (error: any) {
      console.error("Error en el núcleo:", error);
      alert(error.response?.data?.error || "ERROR DE CONEXIÓN CON EL SERVIDOR");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-container" style={{textAlign: 'center', padding: '150px 20px'}}>
        <h2 className="glitch">TU CARRITO ESTÁ VACÍO</h2>
        <Link to="/explorar" className="filter-btn" style={{display: 'inline-block', marginTop: '30px'}}>
          VOLVER A LA TIENDA
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-container" style={{ marginTop: '100px', minHeight: '80vh', padding: '20px' }}>
      <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* SECCIÓN RESUMEN */}
        <div className="checkout-section glass" style={{ padding: '30px' }}>
          <h2 className="sidebar-title" style={{ color: 'var(--neon-blue)', marginBottom: '20px' }}>RESUMEN_DE_CARGA</h2>
          <div className="cart-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {cart.map((item: any) => {
              // Blindaje de datos para evitar errores de .toFixed()
              const itemPrice = Number(item.price) || 0;
              const itemDiscount = Number(item.discount_percentage) || 0;
              const itemQty = Number(item.quantity) || 1;
              const finalPricePerUnit = item.on_sale 
                ? itemPrice * (1 - itemDiscount / 100) 
                : itemPrice;

              return (
                <div key={item.id} className="cart-item-checkout" style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '4px' }}>
                  <img src={item.image_url} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--neon-blue)' }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '14px', fontFamily: 'Orbitron', color: 'white' }}>{item.name}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--neon-green)' }}>
                      {itemQty} x ${finalPricePerUnit.toFixed(2)}
                    </p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                    title="Eliminar producto"
                  >
                    🗑️
                  </button>
                </div>
              );
            })}
          </div>
          <div className="total-bar" style={{ marginTop: '30px', padding: '15px', borderTop: '2px solid var(--neon-blue)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Orbitron' }}>TOTAL:</span>
            <span style={{ fontSize: '24px', fontFamily: 'Orbitron', color: 'var(--neon-green)' }}>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* SECCIÓN PAGOS */}
        <div className="checkout-section glass" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
          <h2 className="sidebar-title" style={{ color: 'var(--neon-purple)' }}>PROTOCOLO_DE_PAGO</h2>
          <p style={{ fontSize: '11px', color: 'gray', marginBottom: '10px' }}>
            SELECCIONE EL MÉTODO DE TRANSMISIÓN DE CRÉDITOS
          </p>
          
          {isProcessing ? (
            <div style={{ padding: '40px' }}>
              <h2 className="glitch-small">SINCRONIZANDO...</h2>
              <div className="loading-bar-container" style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', marginTop: '20px' }}>
                <div className="loading-bar" style={{ width: '60%', height: '100%', background: 'var(--neon-blue)' }}></div>
              </div>
            </div>
          ) : (
            <>
              <button 
                className="buy-button glass" 
                style={{ border: '2px solid #009EE3', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }} 
                onClick={() => procesarCompra('MP')}
              >
                <span style={{ fontSize: '16px' }}>MERCADO PAGO</span>
                <small style={{ fontSize: '9px', opacity: 0.7 }}>PROCESAMIENTO AUTOMÁTICO</small>
              </button>

              <button 
                className="buy-button glass" 
                style={{ border: '2px solid #25D366', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }} 
                onClick={() => procesarCompra('WA')}
              >
                <span style={{ fontSize: '16px' }}>WHATSAPP</span>
                <small style={{ fontSize: '9px', opacity: 0.7 }}>ACORDAR CON OPERADOR</small>
              </button>

              <div style={{ marginTop: '20px', padding: '15px', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '4px' }}>
                <p style={{ fontSize: '10px', color: '#888', lineHeight: '1.4' }}>
                  * Al elegir WhatsApp, un operador recibirá su lista de productos para coordinar la entrega y el pago manual.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;