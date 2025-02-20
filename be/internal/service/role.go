package service

import (
	"time"

	"github.com/gufakto/cms/domain"
	"github.com/gufakto/cms/dto"
)

type roleService struct {
	roleRepository domain.RoleRepository
}

func NewRole(roleRepository domain.RoleRepository) domain.RoleService {
	return &roleService{
		roleRepository: roleRepository,
	}
}

// Create implements domain.RoleService.
func (r *roleService) Create(role *dto.RoleReq) error {
	dataset := &domain.Role{
		Name:        role.Name,
		Description: role.Description,
		Type:        role.Type,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}
	err := r.roleRepository.Create(dataset)
	if err != nil {
		return err
	}
	return nil
}

// Delete implements domain.RoleService.
func (r *roleService) Delete(id int64) error {
	err := r.roleRepository.Delete(id)
	if err != nil {
		return err
	}
	return nil
}

// FindAll implements domain.RoleService.
func (r *roleService) FindAll(page int, limit int) ([]dto.RoleRes, error) {
	res, err := r.roleRepository.FindAll(page, limit)
	if err != nil {
		return nil, err
	}
	var resDto []dto.RoleRes
	for _, v := range res {
		resDto = append(resDto, dto.RoleRes{
			ID:          v.ID,
			Name:        v.Name,
			Description: v.Description,
			Type:        v.Type,
			CreatedAt:   v.CreatedAt,
			UpdatedAt:   v.UpdatedAt,
		})
	}
	return resDto, nil
}

// FindByID implements domain.RoleService.
func (r *roleService) FindByID(id int64) (dto.RoleRes, error) {
	dataset, err := r.roleRepository.FindByID(id)
	if err != nil {
		return dto.RoleRes{}, err
	}
	resDto := dto.RoleRes{
		ID:          dataset.ID,
		Name:        dataset.Name,
		Description: dataset.Description,
		Type:        dataset.Type,
		CreatedAt:   dataset.CreatedAt,
		UpdatedAt:   dataset.UpdatedAt,
	}
	return resDto, nil
}

// Update implements domain.RoleService.
func (r *roleService) Update(id int64, role *dto.RoleReq) error {
	dataset, err := r.roleRepository.FindByID(id)
	if err != nil {
		return err
	}
	dataset.Name = role.Name
	dataset.Description = role.Description
	dataset.Type = role.Type
	dataset.UpdatedAt = time.Now()
	err = r.roleRepository.Update(dataset)
	if err != nil {
		return err
	}
	return nil
}
