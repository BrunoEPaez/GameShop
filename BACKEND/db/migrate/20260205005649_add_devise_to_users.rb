class AddDeviseToUsers < ActiveRecord::Migration[8.1]
  def self.up
    # Dejamos esto vacío para que Rails no intente crear columnas que ya existen
  end

  def self.down
    raise ActiveRecord::IrreversibleMigration
  end
end