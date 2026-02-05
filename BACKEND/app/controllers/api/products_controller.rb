class Api::ProductsController < ApplicationController
  before_action :set_product, only: %i[ show update destroy ]

  # GET /api/products
  def index
    @products = Product.all.with_attached_image.with_attached_gallery_images
    render json: @products.map { |product| format_product(product) }
  end

  # GET /api/products/1
  def show
    render json: format_product(@product)
  end

  # POST /api/products
  def create
    @product = Product.new(product_params)
    if @product.save
      render json: format_product(@product), status: :created
    else
      render json: @product.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/products/1
  def update
    if @product.update(product_params)
      render json: format_product(@product)
    else
      render json: @product.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/products/1
  def destroy
    @product.destroy
    head :no_content
  end

  # --- MÉTODO DE CHECKOUT CON REGISTRO DE VENTA ---
  def checkout
    cart_items = params[:cart]
    
    if cart_items.blank?
      return render json: { error: "El carrito está vacío" }, status: :unprocessable_entity
    end

    ActiveRecord::Base.transaction do
      total_venta = 0
      lineas_descripcion = []

      cart_items.each do |item|
        product = Product.find(item[:id])
        cantidad = item[:quantity].to_i
        
        if product.stock >= cantidad
          # Calcular el precio real (aplicando descuento si existe)
          precio_unitario = if product.on_sale && product.discount_percentage.to_i > 0
                              product.price * (1 - product.discount_percentage.to_f / 100)
                            else
                              product.price
                            end
          
          total_venta += precio_unitario * cantidad
          lineas_descripcion << "#{cantidad}x #{product.name}"

          # Descontar stock
          product.update!(stock: product.stock - cantidad)
        else
          raise "Stock insuficiente para #{product.name}. Disponible: #{product.stock}"
        end
      end

      # --- REGISTRO EN LA TABLA DE VENTAS ---
      # Esto es lo que hace que aparezcan en el AdminPanel
      Sale.create!(
        transaction_id: "LCL-#{SecureRandom.hex(4).upcase}",
        total_price: total_venta,
        items_description: lineas_descripcion.join(", "),
        status: "COMPLETADO"
      )
    end

    render json: { message: "COMPRA PROCESADA Y REGISTRADA CON ÉXITO" }, status: :ok
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  private

  def set_product
    @product = Product.find(params[:id])
  end

  def format_product(product)
    product.as_json.merge({
      image_url: product.image.attached? ? url_for(product.image) : nil,
      gallery_urls: product.gallery_images.attached? ? product.gallery_images.map { |img| url_for(img) } : []
    })
  end

  def product_params
    params.require(:product).permit(
      :name, :description, :price, :stock, :category, 
      :secondary_category, :on_sale, :discount_percentage, 
      :new_until_days, :status, :image, gallery_images: []
    )
  end
end