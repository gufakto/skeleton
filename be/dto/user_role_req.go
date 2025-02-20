package dto

type UserRoleReq struct {
	UserID int64   `json:"user"`
	RoleID []int64 `json:"roles"`
}

func (req UserRoleReq) Validate() error {
	if req.UserID == 0 {
		return ErrUserIDRequired
	}
	if len(req.RoleID) == 0 {
		return ErrRoleIDRequired
	}
	return nil
}
