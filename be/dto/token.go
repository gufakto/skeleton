package dto

type Tokens struct {
	Token               string `json:"token"`
	RefreshToken        string `json:"refresh_token"`
	TokenExpires        int64  `json:"token_expires"`
	RefreshTokenExpires int64  `json:"refresh_token_expires"`
}

type TokenAfterRefresh struct {
	Token        string `json:"token"`
	TokenExpires int64  `json:"token_expires"`
}
