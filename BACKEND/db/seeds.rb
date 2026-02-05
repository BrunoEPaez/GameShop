puts "Limpiando base de datos..."
Product.destroy_all

puts "Cargando inventario LEGENDARIO de GamerShop..."

products = [
  # --- JUEGOS (12 Productos) ---
  { name: "Black Myth: Wukong", description: "RPG de acción basado en la mitología china. El éxito del año.", price: 59.99, stock: 50, category: "JUEGOS", image_url: "https://image.api.playstation.com/vulcan/ap/rnd/202406/0603/9262f26038e9c68a4d7072a297746f363c32b9c71619a93c.png" },
  { name: "Elden Ring: Shadow of the Erdtree", description: "La expansión definitiva del mejor juego de 2022.", price: 39.99, stock: 30, category: "JUEGOS", image_url: "https://image.api.playstation.com/vulcan/ap/rnd/202402/2012/2660ef7f7a83d73bc26673551523f03b22b7c46271c0800c.png" },
  { name: "FC25 - Standard Edition", description: "Nueva temporada, nuevas tácticas con FC IQ.", price: 69.99, stock: 100, category: "JUEGOS", image_url: "https://cdn.artstation.com/p/assets/images/images/078/077/133/large/m-asif-asif-fc25-standard.jpg" },
  { name: "Cyberpunk 2077: Ultimate Edition", description: "Incluye Phantom Liberty y todas las mejoras 2.1.", price: 55.00, stock: 20, category: "JUEGOS", image_url: "https://image.api.playstation.com/vulcan/ap/rnd/202311/1717/7e155b41065963f45c8540b611e9a7e6b026639c65603704.png" },
  { name: "God of War Ragnarök", description: "La conclusión épica de la saga nórdica de Kratos.", price: 49.99, stock: 15, category: "JUEGOS", image_url: "https://image.api.playstation.com/vulcan/ap/rnd/202207/1210/4E9VJ99X9ba9S80DHo7p9B3T.png" },
  { name: "Spider-Man 2", description: "Juega como Peter y Miles en una Nueva York expandida.", price: 69.99, stock: 25, category: "JUEGOS", image_url: "https://image.api.playstation.com/vulcan/ap/rnd/202306/0801/447a1961445778a4878a873130ec607f2a71d87f7a5b3a6d.png" },
  { name: "Resident Evil 4 Remake", description: "Sobrevive al terror rural en esta obra maestra reimaginada.", price: 39.99, stock: 12, category: "JUEGOS", image_url: "https://image.api.playstation.com/vulcan/ap/rnd/202210/0714/S99979S29ba9S80DHo7p9B3T.png" },
  { name: "Final Fantasy VII Rebirth", description: "El viaje hacia lo desconocido continúa fuera de Midgar.", price: 69.99, stock: 18, category: "JUEGOS", image_url: "https://image.api.playstation.com/vulcan/ap/rnd/202309/1410/546f6f9c961c0f0f4a4c6a992850907f1f7d549a1d5a5a5a.png" },
  { name: "Helldivers 2", description: "Lleva la democracia gestionada a toda la galaxia.", price: 39.99, stock: 60, category: "JUEGOS", image_url: "https://image.api.playstation.com/vulcan/ap/rnd/202309/0718/2da9S29ba9S80DHo7p9B3T.png" },
  { name: "Star Wars Outlaws", description: "El primer juego de mundo abierto de Star Wars.", price: 69.99, stock: 22, category: "JUEGOS", image_url: "https://store-images.s-microsoft.com/proxy/icu/640/star-wars-outlaws.jpg" },
  { name: "The Last of Us Part II Remastered", description: "Vive la historia de Ellie con mejoras técnicas para PS5.", price: 49.99, stock: 10, category: "JUEGOS", image_url: "https://image.api.playstation.com/vulcan/ap/rnd/202311/1411/7e155b41065963f45c8540b611e9a7e6b026639c65603704.png" },
  { name: "Hogwarts Legacy", description: "Vive lo inesperado en el mundo mágico del siglo XIX.", price: 45.00, stock: 35, category: "JUEGOS", image_url: "https://image.api.playstation.com/vulcan/ap/rnd/202211/0900/6vS99S29ba9S80DHo7p9B3T.png" },

  # --- CONSOLAS (8 Productos) ---
  { name: "PS5 Slim Disc Edition", description: "Diseño más delgado con lector de discos y 1TB SSD.", price: 499.00, stock: 15, category: "CONSOLAS", image_url: "https://gmedia.playstation.com/is/image/SIEPDC/playstation-5-slim-disc-console-product-shot-01-en-24nov23?$1600px$" },
  { name: "PS5 Pro", description: "La consola más potente del mundo con IA para gráficos.", price: 699.99, stock: 5, category: "CONSOLAS", image_url: "https://gmedia.playstation.com/is/image/SIEPDC/playstation-5-pro-console-product-shot-01-en-24sep24" },
  { name: "Xbox Series X", description: "4K real, 120 FPS y el alma de Microsoft.", price: 499.00, stock: 10, category: "CONSOLAS", image_url: "https://assets.xboxservices.com/assets/fb/d2/fbd2ac3e-6c31-4452-9f6c-662ad853f93f.png" },
  { name: "Xbox Series S - Carbon Black", description: "Toda la velocidad de la nueva generación con 1TB.", price: 349.00, stock: 20, category: "CONSOLAS", image_url: "https://assets.xboxservices.com/assets/f1/8b/f18b321a-6c31-4452-9f6c-662ad853f93f.png" },
  { name: "Nintendo Switch OLED White", description: "Pantalla OLED de 7 pulgadas y colores vibrantes.", price: 349.00, stock: 25, category: "CONSOLAS", image_url: "https://assets.nintendo.com/image/upload/f_auto/q_auto/c_fill,w_800/ncom/en_US/switch/site-design-update/hardware/switch-oled-model-white-announcement" },
  { name: "Nintendo Switch Lite Blue", description: "La mejor opción para jugar en modo portátil.", price: 199.00, stock: 30, category: "CONSOLAS", image_url: "https://assets.nintendo.com/image/upload/f_auto/q_auto/c_fill,w_800/ncom/en_US/hardware/switch-lite-blue-hardware" },
  { name: "PlayStation Portal", description: "Reproductor remoto para tu consola PS5.", price: 199.99, stock: 8, category: "CONSOLAS", image_url: "https://gmedia.playstation.com/is/image/SIEPDC/playstation-portal-remote-player-product-shot-01-en-31aug23" },
  { name: "Steam Deck OLED 512GB", description: "Tu biblioteca de Steam en la palma de tu mano.", price: 549.00, stock: 7, category: "CONSOLAS", image_url: "https://clan.cloudflare.steamstatic.com/images/43474744/2984920678667614041.png" },

  # --- PC GAMER (10 Productos) ---
  { name: "PC Gamer Helios I", description: "Ryzen 7, RTX 4070, 32GB RAM DDR5, Case RGB.", price: 1599.00, stock: 4, category: "PC GAMER", image_url: "https://dlcdnwebimgs.asus.com/gain/0F228D3A-C43E-4B07-A41B-E0AF267D22A7" },
  { name: "PC Gamer Titan X", description: "Core i9 14900K, RTX 4090, 64GB RAM, Refrigeración Líquida.", price: 3899.00, stock: 2, category: "PC GAMER", image_url: "https://www.cyberpowerpc.com/images/cs/p418/cs-450-161_400.png" },
  { name: "Laptop ASUS ROG Zephyrus G14", description: "Potencia portátil con Ryzen 9 y RTX 4060.", price: 1450.00, stock: 6, category: "PC GAMER", image_url: "https://dlcdnwebimgs.asus.com/gain/49080275-8025-46D4-A759-455B6082F81D" },
  { name: "Laptop Razer Blade 15", description: "La laptop gamer más premium del mercado.", price: 2799.00, stock: 3, category: "PC GAMER", image_url: "https://assets2.razerzone.com/images/pnx.assets/763c7849c063b4f6e1657c91d848148b/razer-blade-16-2024-laptop-500x500.png" },
  { name: "Tarjeta de Video RTX 4080 Super", description: "Domina cualquier juego en 4K con Ray Tracing.", price: 1199.00, stock: 10, category: "PC GAMER", image_url: "https://dlcdnwebimgs.asus.com/gain/D208D3A-C43E-4B07-A41B-E0AF267D22A7" },
  { name: "Procesador AMD Ryzen 9 7950X3D", description: "El mejor procesador para gaming del mundo.", price: 650.00, stock: 15, category: "PC GAMER", image_url: "https://m.media-amazon.com/images/I/51pI-E62nDL._AC_SL1000_.jpg" },
  { name: "Memoria RAM Corsair Vengeance 32GB", description: "DDR5 6000MHz con iluminación RGB dinámica.", price: 160.00, stock: 40, category: "PC GAMER", image_url: "https://m.media-amazon.com/images/I/71YvR0Y7XTL._AC_SL1500_.jpg" },
  { name: "Monitor Samsung Odyssey G9", description: "49 pulgadas ultra ancho para una inmersión total.", price: 1299.00, stock: 5, category: "PC GAMER", image_url: "https://images.samsung.com/is/image/samsung/p6pim/ar/lc49g95tssxzB/gallery/ar-odyssey-g9-g95t-337583-lc49g95tssxzb-530635951" },
  { name: "Monitor LG UltraGear 27'", description: "Panel IPS, 144Hz, 1ms de respuesta.", price: 299.00, stock: 12, category: "PC GAMER", image_url: "https://www.lg.com/us/images/monitors/md07521501/gallery/desktop-01.jpg" },
  { name: "SSD WD Black 2TB NVMe", description: "Velocidades de hasta 7300 MB/s para PS5 y PC.", price: 189.00, stock: 25, category: "PC GAMER", image_url: "https://m.media-amazon.com/images/I/71YvR0Y7XTL._AC_SL1500_.jpg" },

  # --- PERIFÉRICOS (10 Productos) ---
  { name: "Mouse Logitech G502 X Plus", description: "El mouse gamer más popular, ahora con tecnología Lightspeed.", price: 159.00, stock: 30, category: "PERIFÉRICOS", image_url: "https://resource.logitechg.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/g502x-plus/g502x-plus-gallery-1-black.png" },
  { name: "Teclado SteelSeries Apex Pro", description: "Teclado mecánico con switches ajustables magnéticos.", price: 199.00, stock: 15, category: "PERIFÉRICOS", image_url: "https://media.steelseriescdn.com/thumbs/catalog/items/64626/18485290b3974412953686259c7608d5.png" },
  { name: "Headset Razer BlackShark V2 Pro", description: "Audio inalámbrico de alta fidelidad para eSports.", price: 179.00, stock: 20, category: "PERIFÉRICOS", image_url: "https://assets2.razerzone.com/images/pnx.assets/0927083049102604f3235b2e3c042302/blackshark-v2-pro-category-500x500.png" },
  { name: "Silla Gaming Secretlab TITAN Evo", description: "Ergonomía de primer nivel para largas sesiones.", price: 549.00, stock: 5, category: "PERIFÉRICOS", image_url: "https://images.secretlab.co/theme/common/titan_evo_2022_stealth_1-min.png" },
  { name: "Control PS5 DualSense Edge", description: "Control ultra personalizable para jugadores competitivos.", price: 199.00, stock: 10, category: "PERIFÉRICOS", image_url: "https://gmedia.playstation.com/is/image/SIEPDC/dualsense-edge-product-shot-01-en-24aug22" },
  { name: "Micrófono HyperX QuadCast S", description: "Micrófono USB con iluminación RGB y calidad de estudio.", price: 149.00, stock: 18, category: "PERIFÉRICOS", image_url: "https://row.hyperx.com/cdn/shop/products/hyperx_quadcast_s_1_main_900x.png" },
  { name: "Cámara Razer Kiyo Pro", description: "Streaming en 1080p 60FPS con sensor de luz adaptable.", price: 99.00, stock: 12, category: "PERIFÉRICOS", image_url: "https://assets2.razerzone.com/images/pnx.assets/0927083049102604f3235b2e3c042302/kiyo-pro-category-500x500.png" },
  { name: "Pad Mouse Corsair MM700 RGB", description: "Superficie de tela extendida con bordes iluminados.", price: 59.00, stock: 25, category: "PERIFÉRICOS", image_url: "https://m.media-amazon.com/images/I/61mI-8m2pSL._AC_SL1500_.jpg" },
  { name: "Control Xbox Elite Series 2", description: "El control más avanzado para Xbox y PC.", price: 179.00, stock: 14, category: "PERIFÉRICOS", image_url: "https://assets.xboxservices.com/assets/f4/8c/f48c321a-6c31-4452-9f6c-662ad853f93f.png" },
  { name: "Altavoces Logitech G560 RGB", description: "Sistema de altavoces 2.1 con tecnología Lightsync.", price: 199.00, stock: 8, category: "PERIFÉRICOS", image_url: "https://resource.logitechg.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/g560/g560-gallery-1.png" }
]

Product.create!(products)

puts "¡Surtido masivo completado! Total: #{Product.count} productos cargados."