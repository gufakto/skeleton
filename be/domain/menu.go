package domain

type Menu struct {
	ID          int64  `gorm:"id"`
	Name        string `gorm:"name"`
	Description string `gorm:"description"`
	ParentID    int64  `gorm:"parent_id"`
	CreatedAt   string `gorm:"created_at"`
	UpdatedAt   string `gorm:"updated_at"`
	DeletedAt   string `gorm:"deleted_at"`
}
type MenuRepository interface {
	Create(menu *Menu) error
	Update(menu *Menu) error
	Delete(id int64) error
	GetByID(id int64) (Menu, error)
	GetByParentID(parentID int64) ([]Menu, error)
}
type MenuService interface {
	Create(menu *Menu) error
	Update(menu *Menu) error
	Delete(id int64) error
	GetByID(id int64) (Menu, error)
	GetByParentID(parentID int64) ([]Menu, error)
}
