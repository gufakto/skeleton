package domain

import (
	"database/sql"
	"time"

	"github.com/gufakto/cms/dto"
)

type Role struct {
	ID          int64        `gorm:"id"`
	Name        string       `gorm:"name;unique"`
	Description string       `gorm:"description"`
	Type        string       `gorm:"'type'"`
	CreatedAt   time.Time    `gorm:"created_at"`
	UpdatedAt   time.Time    `gorm:"updated_at"`
	DeletedAt   sql.NullTime `gorm:"deleted_at"`
}

type RoleRepository interface {
	Create(role *Role) error
	FindAll(page int, limit int) ([]Role, error)
	FindByID(id int64) (*Role, error)
	Update(role *Role) error
	Delete(id int64) error
}

type RoleService interface {
	Create(role *dto.RoleReq) error
	FindAll(page int, limit int) ([]dto.RoleRes, error)
	FindByID(id int64) (dto.RoleRes, error)
	Update(id int64, role *dto.RoleReq) error
	Delete(id int64) error
}
