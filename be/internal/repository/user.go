package repository

import (
	"database/sql"
	"time"

	"github.com/gufakto/cms/domain"
	"gorm.io/gorm"
)

type userRepository struct {
	db *gorm.DB
}

func NewUser(db *gorm.DB) domain.UserRepository {
	return &userRepository{
		db: db,
	}
}

// Create implements domain.UserRepository.
func (u *userRepository) Create(user *domain.User) error {
	res := u.db.Model(domain.User{}).Create(&user)
	if res.Error != nil {
		return res.Error
	}
	return nil
}

// Delete implements domain.UserRepository.
func (u *userRepository) Delete(id int64) error {
	var dataset *domain.User
	ex := u.db.Where("id = ?", id).First(&dataset)
	if ex.Error != nil {
		return ex.Error
	}
	nullableTime := sql.NullTime{
		Time:  time.Now(),
		Valid: true,
	}
	dataset.DeletedAt = nullableTime
	ex = u.db.Save(&dataset)
	if ex.Error != nil {
		return ex.Error
	}
	return nil
}

// GetByID implements domain.UserRepository.
func (u *userRepository) GetByID(id int64) (dataset domain.User, err error) {
	ex := u.db.Where("id = ? AND deleted_at IS NULL", id).FirstOrInit(&dataset)
	return dataset, ex.Error
}

// Update implements domain.UserRepository.
func (u *userRepository) Update(user *domain.User) error {
	ex := u.db.Save(user)
	return ex.Error
}

// GetPaginate implements domain.UserRepository.
func (u *userRepository) GetPaginate(page int, limit int) (users []domain.User, err error) {
	offset := (page - 1) * limit
	err = u.db.Where("deleted_at IS NULL").Limit(limit).Offset(offset).Find(&users).Error
	return
}

// GetByEmail implements domain.UserRepository.
func (u *userRepository) GetByEmail(email string) (dataset domain.User, err error) {
	ex := u.db.Where("email = ? AND deleted_at IS NULL", email).FirstOrInit(&dataset)
	return dataset, ex.Error
}
