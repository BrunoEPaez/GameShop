class AddCyberDetailsToProducts < ActiveRecord::Migration[8.1]
  def change
    add_column :products, :secondary_category, :string
    add_column :products, :on_sale, :boolean
    add_column :products, :discount_percentage, :integer
  end
end
