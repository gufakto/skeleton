package utils

import (
	"log"
	"math/rand"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/gufakto/cms/dto"
	"github.com/gufakto/cms/internal/config"
)

func GenerateRandString(n int) string {
	rand.New(rand.NewSource(time.Now().UnixNano()))
	var charsets = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
	var b = make([]rune, n)
	for i := range b {
		b[i] = charsets[rand.Intn(len(charsets))]
	}
	return string(b)
}

func GenerateRandNumber(n int) string {
	rand.New(rand.NewSource(time.Now().UnixNano()))
	var charsets = []rune("0123456789")
	var b = make([]rune, n)
	for i := range b {
		b[i] = charsets[rand.Intn(len(charsets))]
	}
	return string(b)
}

func GenerateTokenAndRefreshToken(username string) (*dto.Tokens, error) {
	cnf := config.Get()
	jwtSecretKey := []byte(cnf.Token.TokenKey)
	jwtRefreshSecretKey := []byte(cnf.Token.RefresTokenKey)

	// Access token
	accessTokenExp := time.Now().Add(time.Minute * time.Duration(cnf.Token.TokenExp)).Unix() // Expires in 15 minutes
	accessTokenClaims := &dto.CustomClaims{
		Username: username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: accessTokenExp,
		},
	}
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessTokenClaims)
	accessTokenStr, err := accessToken.SignedString(jwtSecretKey)
	if err != nil {
		log.Println("DONAL" + err.Error())
		return nil, err
	}

	// Refresh token
	refreshTokenExp := time.Now().Add(time.Hour * 24 * time.Duration(cnf.Token.RefreshTokenExp)).Unix() // Expires in 7 days
	refreshTokenClaims := &dto.CustomClaims{
		Username: username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: refreshTokenExp,
		},
	}
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshTokenClaims)
	refreshTokenStr, err := refreshToken.SignedString(jwtRefreshSecretKey)
	if err != nil {
		log.Println("DONAL 1")
		return nil, err
	}

	return &dto.Tokens{
		Token:               accessTokenStr,
		RefreshToken:        refreshTokenStr,
		TokenExpires:        accessTokenExp,
		RefreshTokenExpires: refreshTokenExp,
	}, nil
}

func GenerateToken(username string, cnf *config.Config) (*dto.TokenAfterRefresh, error) {
	// cnf := config.Get()
	jwtSecretKey := []byte(cnf.Token.TokenKey)

	// Access token
	accessTokenExp := time.Now().Add(time.Minute * time.Duration(cnf.Token.TokenExp)).Unix() // Expires in 15 minutes
	accessTokenClaims := &dto.CustomClaims{
		Username: username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: accessTokenExp,
		},
	}
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessTokenClaims)
	accessTokenStr, err := accessToken.SignedString(jwtSecretKey)
	if err != nil {
		return nil, err
	}

	return &dto.TokenAfterRefresh{
		Token:        accessTokenStr,
		TokenExpires: accessTokenExp,
	}, nil
}
