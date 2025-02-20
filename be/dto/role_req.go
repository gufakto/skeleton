package dto

import "errors"

type RoleReq struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Type        string `json:"type"`
}

func (r *RoleReq) Validate() error {
	if r.Name == "" {
		return errors.New("name is required")
	}
	if r.Type == "" {
		return errors.New("type is required")
	}
	return nil
}
