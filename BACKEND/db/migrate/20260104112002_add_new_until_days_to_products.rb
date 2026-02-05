class AddNewUntilDaysToProducts < ActiveRecord::Migration[8.1]
  def change
    add_column :products, :new_until_days, :integer
  end
end
