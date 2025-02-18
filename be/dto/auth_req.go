package dto

import (
	"log"
	"net/mail"
	"strings"
)

type AuthReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (dto *AuthReq) Validate() error {
	if dto.Email == "" {
		return ErrEmailRequired
	}
	_, err := mail.ParseAddress(strings.TrimSpace(dto.Email))
	log.Println(err)
	if err != nil {
		return ErrInvalidEmail
	}

	if dto.Password == "" {
		return ErrPasswordRequired
	}
	return nil
}
