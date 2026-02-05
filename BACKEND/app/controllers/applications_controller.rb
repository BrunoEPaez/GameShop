class ApplicationsController < ApplicationController
  before_action :authenticate_user_from_token

  def index
    render json: @current_user.applied_jobs
  end

  def create
    # Buscamos si ya existe, si no, lo creamos
    @application = @current_user.applications.find_or_initialize_by(job_id: params[:job_id])
    
    # Adjuntamos el archivo si viene en los parámetros
    @application.cv.attach(params[:cv]) if params[:cv].present?

    if @application.save
      render json: { message: "Postulación exitosa" }, status: :created
    else
      render json: { errors: @application.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def index_for_my_jobs
    @applications = Application.joins(:job).where(jobs: { user_id: @current_user.id })
    
    # Usamos un mapeo para incluir la URL del archivo de Active Storage
    render json: @applications.map { |app|
      app.as_json(include: { 
        user: { only: [:email] }, 
        job: { only: [:id, :title] } 
      }).merge({
        # Esto genera la URL para que el reclutador vea el CV
        cv_url: app.cv.attached? ? rails_blob_url(app.cv, only_path: true) : nil
      })
    }
  end
end