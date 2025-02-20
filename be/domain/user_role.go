package domain

type UserRole struct {
	ID     int64 `gorm:"id"`
	UserID int64 `gorm:"user_id;uniqueIndex:user_id,role_id"`
	RoleID int64 `gorm:"role_id;uniqueIndex:user_id,role_id"`
}

type UserRoleRepository interface {
	Create(userRole *UserRole) error
	Delete(id int64) error
	GetByID(id int64) (UserRole, error)
	GetByUserID(userID int64) ([]UserRole, error)
	GetByRoleID(roleID int64) ([]UserRole, error)
	CreateMultiple(userRoles []UserRole) error
}
