package domain

type RoleMenu struct {
	ID        int64  `gorm:"id"`
	RoleID    int64  `gorm:"role_id"`
	MenuID    int64  `gorm:"menu_id"`
	CreatedAt string `gorm:"created_at"`
	UpdatedAt string `gorm:"updated_at"`
	DeletedAt string `gorm:"deleted_at"`
}
type RoleMenuRepository interface {
	Create(roleMenu *RoleMenu) error
	Update(roleMenu *RoleMenu) error
	Delete(id int64) error
	GetByID(id int64) (RoleMenu, error)
	GetByRoleID(roleID int64) ([]RoleMenu, error)
	GetByMenuID(menuID int64) ([]RoleMenu, error)
}
