package dto

import "errors"

var ErrAuthFailed = errors.New("authentication failed")
var ErrUsernameTaken = errors.New("username exists")
var ErrOTPInvalid = errors.New("invalid OTP Code")
var ErrAccountNotFound = errors.New("account not found")
var ErrInquiryKeyNotFound = errors.New("inquiry key not found")
var ErrInsufficientBalance = errors.New("insufficient balance")
var ErrInvalidPassword = errors.New("invalid password")
var ErrInvalidEmail = errors.New("invalid email")
var ErrInvalidPhone = errors.New("invalid phone")
var ErrEmailRequired = errors.New("email required")
var ErrPasswordRequired = errors.New("password required")
var ErrNoDataFound = errors.New("no data found")
var ErrInvalidToken = errors.New("invalid token")
var ErrFailedGenerateToken = errors.New("failed to generate token")
var ErrRefreshTokenRequired = errors.New("refresh token required")
