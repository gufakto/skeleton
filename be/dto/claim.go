package dto

import "github.com/golang-jwt/jwt"

// CustomClaims represents the custom claims for JWT
type CustomClaims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}
