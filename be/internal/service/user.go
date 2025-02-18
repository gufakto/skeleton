package service

import (
	"fmt"
	"time"

	"github.com/gufakto/cms/domain"
	"github.com/gufakto/cms/dto"
	"golang.org/x/crypto/bcrypt"
)

type userService struct {
	userRepo domain.UserRepository
}

func NewUser(userRepo domain.UserRepository) domain.UserService {
	return &userService{
		userRepo: userRepo,
	}
}

// Create implements domain.UserService.
func (u *userService) Create(user *dto.UserReq) (dto.UserData, error) {
	hasPass, _ := bcrypt.GenerateFromPassword([]byte(user.Password), 12)
	userDataSet := domain.User{
		Name:      user.Name,
		Email:     user.Email,
		Password:  string(hasPass),
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	err := u.userRepo.Create(&userDataSet)
	if err != nil {
		return dto.UserData{}, err
	}
	return dto.UserData{
		ID:        userDataSet.ID,
		Name:      userDataSet.Name,
		Email:     userDataSet.Email,
		CreatedAt: userDataSet.CreatedAt,
		UpdatedAt: userDataSet.UpdatedAt,
	}, nil
}

// Delete implements domain.UserService.
func (u *userService) Delete(id int64) error {
	dataset, err := u.userRepo.GetByID(id)
	if err != nil {
		return err
	}
	if dataset.ID == 0 {
		return fmt.Errorf("user not found")
	}
	return u.userRepo.Delete(id)
}

// GetByID implements domain.UserService.
func (u *userService) GetByID(id int64) (user dto.UserData, err error) {
	dataset, err := u.userRepo.GetByID(id)
	if err != nil {
		return dto.UserData{}, err
	}
	if dataset == (domain.User{}) {
		return dto.UserData{}, dto.ErrNoDataFound
	}
	return dto.UserData{
		ID:        dataset.ID,
		Name:      dataset.Name,
		Email:     dataset.Email,
		CreatedAt: dataset.CreatedAt,
		UpdatedAt: dataset.UpdatedAt,
	}, nil
}

// Update implements domain.UserService.
func (u *userService) Update(user dto.UserUpdateReq, id int64) (dto.UserData, error) {
	dataset, err := u.userRepo.GetByID(id)
	if err != nil {
		return dto.UserData{}, dto.ErrNoDataFound
	}
	dataset.Name = user.Name
	dataset.Email = user.Email
	dataset.UpdatedAt = time.Now()
	err = u.userRepo.Update(&dataset)
	if err != nil {
		return dto.UserData{}, err
	}
	return dto.UserData{
		ID:        dataset.ID,
		Name:      dataset.Name,
		Email:     dataset.Email,
		CreatedAt: dataset.CreatedAt,
		UpdatedAt: dataset.UpdatedAt,
	}, nil

}

// GetPaginate implements domain.UserService.
func (u *userService) GetPaginate(page int, limit int) ([]dto.UserData, error) {
	dataset, err := u.userRepo.GetPaginate(page, limit)
	fmt.Println(dataset)
	if err != nil {
		return []dto.UserData{}, err
	}
	var users []dto.UserData
	for item := range dataset {
		users = append(users, dto.UserData{
			ID:        dataset[item].ID,
			Name:      dataset[item].Name,
			Email:     dataset[item].Email,
			Blocked:   dataset[item].Blocked,
			CreatedAt: dataset[item].CreatedAt,
			UpdatedAt: dataset[item].UpdatedAt,
		})
	}
	if users == nil {
		users = make([]dto.UserData, 0)
	}
	return users, nil
}
