class CreateSales < ActiveRecord::Migration[8.1]
  def change
    create_table :sales do |t|
      t.string :transaction_id
      t.decimal :total_price
      t.text :items_description
      t.string :status

      t.timestamps
    end
  end
end
