package dto

type AuthRes struct {
	Token               string   `json:"token"`
	RefreshToken        string   `json:"refresh_token"`
	TokenExpires        int64    `json:"token_expires"`
	RefreshTokenExpires int64    `json:"refresh_token_expires"`
	User                UserData `json:"user"`
}
