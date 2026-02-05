class Application < ApplicationRecord
  belongs_to :user
  belongs_to :job

  # Esta línea hace la magia
  has_one_attached :cv
end