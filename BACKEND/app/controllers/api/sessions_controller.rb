# backend/app/controllers/api/sessions_controller.rb
class Api::SessionsController < ApplicationController
  # Agregamos 'raise: false' para evitar el error si el filtro no existe en la configuración API
  skip_before_action :verify_authenticity_token, only: [:create], raise: false

  def create
    # Buscamos al usuario por el email enviado desde React
    user = User.find_by(email: params[:email])

    # valid_password? es el método de Devise para chequear la contraseña encriptada
    if user && user.valid_password?(params[:password])
      
      # Generamos un token provisorio para la sesión que React guardará en localStorage
      token = "GAMER_#{SecureRandom.hex(16)}"

      render json: { 
        status: "SUCCESS",
        message: "CONEXIÓN ESTABLECIDA CON EL NÚCLEO",
        user: {
          id: user.id,
          email: user.email
        },
        token: token
      }, status: :ok
    else
      # Si falla, devolvemos un 401 (Unauthorized) con el mensaje de error para el alert
      render json: { 
        status: "ERROR", 
        error: "ACCESO DENEGADO: CREDENCIALES INVÁLIDAS" 
      }, status: :unauthorized
    end
  end
end