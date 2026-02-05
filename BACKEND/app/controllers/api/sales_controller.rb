class Api::SalesController < ApplicationController
  def index
    @sales = Sale.all.order(created_at: :desc)
    render json: @sales
  end
end