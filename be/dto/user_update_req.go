package dto

import "net/mail"

type UserUpdateReq struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

func (o *UserUpdateReq) Validate() error {
	if o.Email == "" {
		return ErrEmailRequired
	}

	if err, _ := mail.ParseAddress(o.Email); err != nil {
		return ErrInvalidEmail
	}
	return nil
}
