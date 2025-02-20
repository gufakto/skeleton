package repository

import (
	"github.com/gufakto/cms/domain"
	"gorm.io/gorm"
)

type userRoleRepository struct {
	db *gorm.DB
}

func NewUserRole(db *gorm.DB) domain.UserRoleRepository {
	return &userRoleRepository{
		db: db,
	}
}

// Create implements domain.UserRoleRepository.
func (u *userRoleRepository) Create(userRole *domain.UserRole) error {
	set := u.db.Model(domain.UserRole{}).Create(&userRole)
	if set.Error != nil {
		return set.Error
	}
	return nil
}

// Delete implements domain.UserRoleRepository.
func (u *userRoleRepository) Delete(id int64) error {
	res := u.db.Delete(&domain.UserRole{}, id)
	if res.Error != nil {
		return res.Error
	}
	return nil
}

// GetByID implements domain.UserRoleRepository.
func (u *userRoleRepository) GetByID(id int64) (dataset domain.UserRole, err error) {
	set := u.db.Model(domain.UserRole{}).Where("id = ?", id).FirstOrInit(&dataset)
	return dataset, set.Error
}

// GetByRoleID implements domain.UserRoleRepository.
func (u *userRoleRepository) GetByRoleID(roleID int64) (dataset []domain.UserRole, err error) {
	set := u.db.Model(domain.UserRole{}).Where("role_id = ?", roleID).Find(&dataset)
	return dataset, set.Error
}

// GetByUserID implements domain.UserRoleRepository.
func (u *userRoleRepository) GetByUserID(userID int64) ([]domain.UserRole, error) {
	var dataset []domain.UserRole
	set := u.db.Model(domain.UserRole{}).Where("user_id = ?", userID).Find(&dataset)
	return dataset, set.Error
}

// CreateMultpile implements domain.UserRoleRepository.
func (u *userRoleRepository) CreateMultiple(userRoles []domain.UserRole) error {
	set := u.db.Model(domain.UserRole{}).Create(&userRoles)
	if set.Error != nil {
		return set.Error
	}
	return nil
}
