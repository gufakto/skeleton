package api

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gufakto/cms/domain"
	"github.com/gufakto/cms/dto"
)

type authApi struct {
	authService domain.AuthService
}

func NewAuth(app *fiber.App, authService domain.AuthService) {
	api := authApi{
		authService: authService,
	}
	app.Post("/v1/auth/login", api.Login)
	app.Post("/v1/auth/refresh-token", api.RefreshToken)
}

func (api *authApi) Login(ctx *fiber.Ctx) error {
	var loginReq dto.AuthReq
	if err := ctx.BodyParser(&loginReq); err != nil {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(dto.Response{
			Message: err.Error(),
		})
	}

	if err := loginReq.Validate(); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(dto.Response{
			Message: err.Error(),
		})
	}

	res, err := api.authService.Login(loginReq)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(dto.Response{
			Message: err.Error(),
		})
	}
	return ctx.Status(fiber.StatusOK).JSON(dto.ResponseData{
		Data: res,
	})
}

func (api *authApi) RefreshToken(ctx *fiber.Ctx) error {
	var refToken dto.RefreshTokenReq
	if err := ctx.BodyParser(&refToken); err != nil {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(dto.Response{
			Message: err.Error(),
		})
	}

	if err := refToken.Validate(); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(dto.Response{
			Message: err.Error(),
		})
	}

	res, err := api.authService.RefreshToken(refToken.RefreshToken)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(dto.Response{
			Message: err.Error(),
		})
	}
	return ctx.Status(fiber.StatusOK).JSON(dto.ResponseData{
		Data: res,
	})
}
