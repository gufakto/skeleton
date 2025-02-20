package repository

import (
	"github.com/gufakto/cms/domain"
	"gorm.io/gorm"
)

type menuRepository struct {
	db *gorm.DB
}

func NewMenu(db *gorm.DB) domain.MenuRepository {
	return &menuRepository{
		db: db,
	}
}

// Create implements domain.MenuRepository.
func (m *menuRepository) Create(menu *domain.Menu) error {
	dataset := m.db.Create(menu)
	return dataset.Error
}

// Delete implements domain.MenuRepository.
func (m *menuRepository) Delete(id int64) error {
	set := m.db.Delete(&domain.Menu{}, id)
	return set.Error
}

// GetByID implements domain.MenuRepository.
func (m *menuRepository) GetByID(id int64) (data domain.Menu, err error) {
	set := m.db.Where("id = ?", id).FirstOrInit(&data)
	return data, set.Error
}

// GetByParentID implements domain.MenuRepository.
func (m *menuRepository) GetByParentID(parentID int64) ([]domain.Menu, error) {
	var data []domain.Menu
	set := m.db.Where("parent_id = ?", parentID).Find(&data)
	return data, set.Error
}

// Update implements domain.MenuRepository.
func (m *menuRepository) Update(menu *domain.Menu) error {
	set := m.db.Save(menu)
	return set.Error
}

// GetPaginate implements domain.MenuRepository.
func (m *menuRepository) GetPaginate(page int, limit int) ([]domain.Menu, error) {
	var data []domain.Menu
	set := m.db.Limit(limit).Offset((page - 1) * limit).Find(&data)
	return data, set.Error
}
