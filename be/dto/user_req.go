package dto

import "net/mail"

type UserReq struct {
	Email    string `json:"email"`
	Name     string `json:"name"`
	Password string `json:"password"`
}

func (o *UserReq) Validate() error {
	if o.Email == "" {
		return ErrEmailRequired
	}

	if _, err := mail.ParseAddress(o.Email); err != nil {
		return ErrInvalidEmail
	}

	if o.Password == "" {
		return ErrPasswordRequired
	}
	return nil
}
