package dto

import "net/mail"

type UserUpdateReq struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Blocked string `json:"blocked"`
}

func (o *UserUpdateReq) Validate() error {
	if o.Email == "" {
		return ErrEmailRequired
	}

	if _, err := mail.ParseAddress(o.Email); err != nil {
		return ErrInvalidEmail
	}
	return nil
}

func (req *UserUpdateReq) IsBlocked() bool {
	return req.Blocked == "true"
}
