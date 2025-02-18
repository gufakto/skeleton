package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

func Get() *Config {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file!")
	}
	tokenExp, err := strconv.Atoi(os.Getenv("JWT_TOKEN_EXPIRATION_MINUTES"))
	if err != nil {
		log.Fatal("Error converting JWT_TOKEN_EXPIRATION_MINUTES to int")
	}

	refreshTokenExp, err := strconv.Atoi(os.Getenv("JWT_REFRESH_TOKEN_EXPIRATION_DAYS"))
	if err != nil {
		log.Fatal("Error converting JWT_REFRESH_TOKEN_EXPIRATION_DAYS to int")
	}

	return &Config{
		Server{
			Host: os.Getenv("SERVER_HOST"),
			Port: os.Getenv("SERVER_PORT"),
		},
		Database{
			Host:     os.Getenv("DB_HOST"),
			Port:     os.Getenv("DB_PORT"),
			DbName:   os.Getenv("DB_NAME"),
			Username: os.Getenv("DB_USERNAME"),
			Password: os.Getenv("DB_PASSWORD"),
		},
		Email{
			Host:     os.Getenv("MAIL_HOST"),
			Port:     os.Getenv("MAIL_PORT"),
			User:     os.Getenv("MAIL_USER"),
			Password: os.Getenv("MAIL_PASSWORD"),
		},
		Token{
			TokenKey:        os.Getenv("JWT_SECRET_KEY"),
			RefresTokenKey:  os.Getenv("JWT_REFRESH_SECRET_KEY"),
			TokenExp:        tokenExp,
			RefreshTokenExp: refreshTokenExp,
		},
	}
}
