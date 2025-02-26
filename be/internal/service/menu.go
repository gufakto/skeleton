package service

import (
	"github.com/gufakto/cms/domain"
	"github.com/gufakto/cms/dto"
	"github.com/gufakto/cms/internal/utils"
)

type menuService struct {
	menuRepo domain.MenuRepository
}

func NewMenu(menuRepo domain.MenuRepository) domain.MenuService {
	return &menuService{
		menuRepo: menuRepo,
	}
}

// Create implements domain.MenuService.
func (m *menuService) Create(menu *dto.MenuReq) error {
	data := domain.Menu{
		Name:        menu.Name,
		Description: menu.Description,
		ParentID:    menu.ParentID,
		Icon:        menu.Icon,
	}
	err := m.menuRepo.Create(&data)
	return err
}

// Delete implements domain.MenuService.
func (m *menuService) Delete(id int64) error {
	err := m.menuRepo.Delete(id)
	return err
}

// GetByID implements domain.MenuService.
func (m *menuService) GetByID(id int64) (dto.MenuRes, error) {
	res, err := m.menuRepo.GetByID(id)
	if err != nil {
		return dto.MenuRes{}, err
	}
	return dto.MenuRes{
		ID:          res.ID,
		Name:        res.Name,
		Description: res.Description,
		ParentID:    res.ParentID,
		Icon:        res.Icon,
		CreatedAt:   res.CreatedAt,
		UpdatedAt:   res.UpdatedAt,
	}, nil
}

// GetByParentID implements domain.MenuService.
func (m *menuService) GetByParentID(parentID int64) ([]*dto.MenuRes, error) {
	res, err := m.menuRepo.GetByParentID(parentID)
	if err != nil {
		return []*dto.MenuRes{}, err
	}
	// var resDto []dto.MenuRes
	// for _, v := range res {
	// 	resDto = append(resDto, dto.MenuRes{
	// 		ID:          v.ID,
	// 		Name:        v.Name,
	// 		Description: v.Description,
	// 		ParentID:    v.ParentID,
	// 		Icon:        v.Icon,
	// 		CreatedAt:   v.CreatedAt,
	// 		UpdatedAt:   v.UpdatedAt,
	// 	})
	// }
	resDto := utils.BuildMenuTree(res)
	return resDto, nil
}

// Update implements domain.MenuService.
func (m *menuService) Update(id int64, menu *dto.MenuReq) error {
	err := m.menuRepo.Update(&domain.Menu{
		ID:          id,
		Name:        menu.Name,
		Description: menu.Description,
		ParentID:    menu.ParentID,
		Icon:        menu.Icon,
	})
	return err
}

// GetPaginate implements domain.MenuService.
func (m *menuService) GetPaginate(page int, limit int) ([]*dto.MenuRes, error) {
	res, err := m.menuRepo.GetPaginate(page, limit)
	if err != nil {
		return []*dto.MenuRes{}, err
	}
	// var resDto []dto.MenuRes
	// for _, v := range res {
	// 	resDto = append(resDto, dto.MenuRes{
	// 		ID:          v.ID,
	// 		Name:        v.Name,
	// 		Description: v.Description,
	// 		ParentID:    v.ParentID,
	// 		Icon:        v.Icon,
	// 		CreatedAt:   v.CreatedAt,
	// 		UpdatedAt:   v.UpdatedAt,
	// 	})
	// }
	resDto := utils.BuildMenuTree(res)

	return resDto, nil
}
