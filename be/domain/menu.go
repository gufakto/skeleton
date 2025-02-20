package domain

import "github.com/gufakto/cms/dto"

type Menu struct {
	ID          int64  `gorm:"id"`
	Name        string `gorm:"name"`
	Description string `gorm:"description"`
	ParentID    int64  `gorm:"parent_id"`
	CreatedAt   string `gorm:"created_at"`
	UpdatedAt   string `gorm:"updated_at"`
}
type MenuRepository interface {
	Create(menu *Menu) error
	Update(menu *Menu) error
	Delete(id int64) error
	GetByID(id int64) (Menu, error)
	GetByParentID(parentID int64) ([]Menu, error)
	GetPaginate(page int, limit int) ([]Menu, error)
}
type MenuService interface {
	Create(menu *dto.MenuReq) error
	Update(id int64, menu *dto.MenuReq) error
	Delete(id int64) error
	GetByID(id int64) (dto.MenuRes, error)
	GetByParentID(parentID int64) ([]dto.MenuRes, error)
	GetPaginate(page int, limit int) ([]dto.MenuRes, error)
}
