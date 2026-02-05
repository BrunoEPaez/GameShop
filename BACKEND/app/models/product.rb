class Product < ApplicationRecord
  # Active Storage para manejo de imágenes
  has_one_attached :image           # Imagen principal (Tapa)
  has_many_attached :gallery_images # Fotos secundarias

  # Validaciones: Asegura que los datos básicos existan
  validates :name, :price, :category, presence: true
  validates :stock, numericality: { greater_than_or_equal_to: 0 }
  
  # Opcional: Para que por defecto el descuento sea 0 si no se pone nada
  after_initialize :set_defaults, if: :new_record?

  def set_defaults
    self.on_sale ||= false
    self.discount_percentage ||= 0
    self.new_until_days ||= 7
  end
end