Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "*" # Tu Frontend de Vite/React
    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true # Importante si usas cookies de sesión
  end
end