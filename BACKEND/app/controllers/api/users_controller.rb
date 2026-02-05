# app/controllers/api/users_controller.rb
class Api::UsersController < ApplicationController # ANTES: Devise::RegistrationsController
  respond_to :json

  def create
    user = User.new(sign_up_params)
    if user.save
      token = JsonWebToken.encode(user_id: user.id)
      render json: { user: user, token: token }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def sign_up_params
    # Asegúrate de que los parámetros vengan envueltos en "user" desde el frontend
    params.require(:user).permit(:email, :password, :password_confirmation)
  end
end