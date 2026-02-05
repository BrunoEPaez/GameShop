class Api::SettingsController < ApplicationController
  # GET /api/settings/:id
  def show
    # Buscamos la configuración, si no existe la creamos con valor "false"
    setting = Setting.find_or_create_by(key: params[:id]) do |s|
      s.value = "false"
    end
    
    # Respondemos con un booleano para que React lo entienda fácil
    render json: { value: setting.value == "true" }
  end

  # PATCH/PUT /api/settings/:id
  def update
    # Buscamos o creamos la configuración para evitar el error 'update for nil'
    setting = Setting.find_or_create_by(key: params[:id])
    
    # Convertimos el valor a string ("true" o "false")
    if setting.update(value: params[:value].to_s)
      render json: { 
        message: "SISTEMA_STATUS_ACTUALIZADO", 
        value: setting.value == "true" 
      }
    else
      render json: { error: "No se pudo actualizar el núcleo" }, status: :unprocessable_entity
    end
  end
end