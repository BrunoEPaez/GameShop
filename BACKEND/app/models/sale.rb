class Sale < ApplicationRecord
  # Opcional: Validaciones para no guardar ventas vacías
  validates :transaction_id, presence: true, uniqueness: true
end