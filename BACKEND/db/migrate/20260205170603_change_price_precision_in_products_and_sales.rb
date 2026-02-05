class ChangePricePrecisionInProductsAndSales < ActiveRecord::Migration[7.0]
  def change
    # Cambiamos el precio en la tabla de productos
    # precision: 15 (total de dígitos), scale: 2 (decimales)
    # Esto permite hasta 999.999.999.999,99
    change_column :products, :price, :decimal, precision: 15, scale: 2

    # También lo cambiamos en la tabla de ventas para que el total no falle
    change_column :sales, :total_price, :decimal, precision: 15, scale: 2
  end
end