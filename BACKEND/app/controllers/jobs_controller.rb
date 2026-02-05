class JobsController < ApplicationController
  # Solo pedimos token para crear, borrar o editar. 
  # El método vive en ApplicationController, no lo repitas aquí.
  before_action :authenticate_user_from_token, only: [:create, :destroy, :update]

  def index
  @jobs = Job.all
  render json: @jobs
end

  def create
    # Esto requiere que en user.rb tengas: has_many :jobs
    @job = @current_user.jobs.build(job_params)
    if @job.save
      render json: @job, status: :created
    else
      render json: { errors: @job.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    @job = @current_user.jobs.find_by(id: params[:id])
    if @job && @job.update(job_params)
      render json: @job
    else
      render json: { error: 'No autorizado o error al editar' }, status: :unauthorized
    end
  end

  def destroy
    @job = @current_user.jobs.find_by(id: params[:id])
    if @job
      @job.destroy
      render json: { message: 'Eliminado correctamente' }, status: :ok
    else
      render json: { error: 'No autorizado' }, status: :unauthorized
    end
  end

  private

  def job_params
    # Agregamos :job_type y :modality para que React pueda guardarlos
    params.require(:job).permit(:title, :company, :description, :location, :job_type, :modality)
  end
end