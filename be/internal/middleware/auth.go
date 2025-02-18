package middleware

import (
	"encoding/json"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	"github.com/gufakto/cms/dto"
	"github.com/gufakto/cms/internal/config"
)

func Authenticate(cnf *config.Config) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		var jwtSecretKey = []byte(cnf.Token.TokenKey)
		tokenString := ctx.Get("Authorization")
		if tokenString == "" {
			return ctx.Status(401).JSON(dto.Response{
				Message: "Token is missing",
			}) //"Token is missing"
		}

		parts := strings.Split(tokenString, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			return ctx.Status(401).JSON(dto.Response{
				Message: "Invalid token format",
			}) // "Invalid token format"
		}

		token, err := jwt.ParseWithClaims(parts[1], &dto.CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
			return jwtSecretKey, nil
		})
		if err != nil {
			return ctx.Status(401).JSON(dto.Response{
				Message: err.Error(),
			}) // "Invalid token"
		}

		if !token.Valid {
			return ctx.Status(401).JSON(dto.Response{
				Message: "Invalid token",
			}) // "Invalid token"

		}

		claims, ok := token.Claims.(*dto.CustomClaims)
		if !ok {
			return ctx.Status(401).JSON(dto.Response{
				Message: "Invalid token claims",
			}) // "Invalid token claims"
		}

		// Attach claims to the request context
		jsonClaims, _ := json.Marshal(claims)
		ctx.Set("claims", string(jsonClaims))

		return ctx.Next()
	}
}
