package domain

import (
	"database/sql"
	"time"

	"github.com/gufakto/cms/dto"
)

type User struct {
	ID                 int64        `gorm:"id;primaryKey"`
	Name               string       `gorm:"name"`
	Email              string       `gorm:"email;unique"`
	Password           string       `gorm:"password"`
	ResetPasswordToken string       `gorm:"reset_password_token"`
	Blocked            bool         `gorm:"blocked"`
	CreatedAt          time.Time    `gorm:"created_at"`
	UpdatedAt          time.Time    `gorm:"updated_at"`
	DeletedAt          sql.NullTime `gorm:"deleted_at"`
}

type UserRepository interface {
	GetPaginate(page int, limit int) ([]User, error)
	Create(user *User) error
	Update(user *User) error
	Delete(id int64) error
	GetByID(id int64) (User, error)
	GetByEmail(email string) (User, error)
}

type UserService interface {
	GetPaginate(page int, limit int) ([]dto.UserData, error)
	Create(user *dto.UserReq) (dto.UserData, error)
	Update(user dto.UserUpdateReq, id int64) (dto.UserData, error)
	Delete(id int64) error
	GetByID(id int64) (dto.UserData, error)
}

type AuthService interface {
	Login(authReq dto.AuthReq) (dto.AuthRes, error)
	RefreshToken(token string) (dto.AuthRes, error)
}
