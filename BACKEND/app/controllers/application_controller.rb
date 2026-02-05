# app/controllers/application_controller.rb
class ApplicationController < ActionController::API
  # Este método es el que usarán los demás controladores
  def authenticate_user_from_token
    header = request.headers['Authorization']
    token = header.split(' ').last if header
    begin
      # Usamos el servicio JWT que ya tienes en lib o services
      decoded = JsonWebToken.decode(token)
      @current_user = User.find(decoded[:user_id])
    rescue
      render json: { error: 'No autorizado' }, status: :unauthorized
    end
  end

  def current_user
    @current_user
  end
end