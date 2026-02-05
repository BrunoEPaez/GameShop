# backend/config/routes.rb
Rails.application.routes.draw do
  # Devise maneja la lógica interna de usuarios
  devise_for :users

  # --- RUTAS DE LA API PARA REACT ---
  namespace :api do
    # Autenticación
    post 'signup', to: 'users#create'
    post 'login',  to: 'sessions#create'

    # Tienda y Productos
    resources :products
    post 'checkout', to: 'products#checkout' # La ruta segura que creamos

    # Administración y Ventas
    get 'sales', to: 'sales#index'
    resources :settings, only: [:show, :update]
    
    # Favoritos y Aplicaciones (Si aún los usas)
    resources :favorites, only: [:index, :create]
    delete 'favorites', to: 'favorites#destroy'
    
    resources :applications, only: [:index, :create]
    delete 'applications', to: 'applications#destroy'
    get '/my_job_applications', to: 'applications#index_for_my_jobs'

    # Otros
    resources :jobs
  end

  # Ruta fuera de namespace para acceso directo si fuera necesario
  resources :products, only: [:index, :show]
end