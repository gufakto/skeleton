package dto

type RefreshTokenReq struct {
	RefreshToken string `json:"refresh_token"`
}

func (o *RefreshTokenReq) Validate() error {
	if o.RefreshToken == "" {
		return ErrRefreshTokenRequired
	}
	return nil
}
