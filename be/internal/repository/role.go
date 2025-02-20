package repository

import (
	"database/sql"
	"time"

	"github.com/gufakto/cms/domain"
	"gorm.io/gorm"
)

type roleRepository struct {
	db *gorm.DB
}

func NewRole(db *gorm.DB) domain.RoleRepository {
	return &roleRepository{
		db: db,
	}
}

// Create implements domain.RoleRepository.
func (r *roleRepository) Create(role *domain.Role) error {
	res := r.db.Model(domain.Role{}).Create(&role)
	if res.Error != nil {
		return res.Error
	}
	return nil
}

// Delete implements domain.RoleRepository.
func (r *roleRepository) Delete(id int64) error {
	var dataset *domain.Role
	res := r.db.Where("id = ? and deleted_at IS NULL", id).First(&dataset)
	if res.Error != nil {
		return res.Error
	}
	nullableTime := sql.NullTime{
		Time:  time.Now(),
		Valid: true,
	}
	dataset.DeletedAt = nullableTime
	res = r.db.Save(&dataset)
	if res.Error != nil {
		return res.Error
	}
	return nil
}

// FindAll implements domain.RoleRepository.
func (r *roleRepository) FindAll(page int, limit int) (roles []domain.Role, err error) {
	offset := (page - 1) * limit
	err = r.db.Where("deleted_at IS NULL").Limit(limit).Offset(offset).Find(&roles).Error
	return
}

// FindByID implements domain.RoleRepository.
func (r *roleRepository) FindByID(id int64) (dataset *domain.Role, err error) {
	ex := r.db.Where("id = ? AND deleted_at IS NULL", id).FirstOrInit(&dataset)
	return dataset, ex.Error
}

// Update implements domain.RoleRepository.
func (r *roleRepository) Update(role *domain.Role) error {
	ex := r.db.Save(role)
	return ex.Error
}
