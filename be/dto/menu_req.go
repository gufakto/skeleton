package dto

import "errors"

type MenuReq struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	ParentID    int64  `json:"parent_id"`
}

func (r *MenuReq) Validate() error {
	if r.Name == "" {
		return errors.New("name is required")
	}
	if r.Description == "" {
		return errors.New("description is required")
	}
	return nil
}
