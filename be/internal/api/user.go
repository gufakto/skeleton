package api

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/gufakto/cms/domain"
	"github.com/gufakto/cms/dto"
)

type userApi struct {
	userService domain.UserService
}

func NewUser(app *fiber.App, userService domain.UserService, authMid fiber.Handler) {
	api := userApi{
		userService: userService,
	}

	app.Get("/v1/admin/user", authMid, api.GetAll)
	app.Post("/v1/admin/user", authMid, api.Create)
	app.Put("/v1/admin/user/:id", authMid, api.Update)
	app.Delete("/v1/admin/user/:id", authMid, api.Delete)
	app.Get("/v1/admin/user/:id", authMid, api.GetByID)
}

func (api userApi) GetAll(ctx *fiber.Ctx) error {
	page, _ := strconv.Atoi(ctx.Query("page"))
	limit, _ := strconv.Atoi(ctx.Query("limit"))
	if page == 0 {
		page = 1
	}
	if limit == 0 {
		limit = 10
	}
	users, err := api.userService.GetPaginate(page, limit)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(dto.Response{
			Message: err.Error(),
		})
	}
	return ctx.Status(fiber.StatusOK).JSON(users)
}

func (api userApi) Create(ctx *fiber.Ctx) error {
	var userReq dto.UserReq
	if err := ctx.BodyParser(&userReq); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(dto.Response{
			Message: err.Error(),
		})
	}

	if err := userReq.Validate(); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(dto.Response{
			Message: err.Error(),
		})
	}

	res, err := api.userService.Create(&userReq)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(dto.Response{
			Message: err.Error(),
		})
	}

	return ctx.Status(fiber.StatusCreated).JSON(dto.ResponseData{
		Data: res,
	})
}

func (api userApi) Update(ctx *fiber.Ctx) error {
	var userReq dto.UserUpdateReq
	if err := ctx.BodyParser(&userReq); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(dto.Response{
			Message: err.Error(),
		})
	}

	if err := userReq.Validate(); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(dto.Response{
			Message: err.Error(),
		})
	}

	id, err := strconv.Atoi(ctx.Params("id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(dto.Response{
			Message: err.Error(),
		})
	}

	res, err := api.userService.Update(userReq, int64(id))
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(dto.Response{
			Message: err.Error(),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(dto.ResponseData{
		Data: res,
	})
}

func (api userApi) Delete(ctx *fiber.Ctx) error {
	id, err := strconv.Atoi(ctx.Params("id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(dto.Response{
			Message: err.Error(),
		})
	}
	err = api.userService.Delete(int64(id))
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(dto.Response{
			Message: err.Error(),
		})
	}
	return ctx.Status(fiber.StatusOK).JSON(dto.Response{
		Message: "success",
	})
}

func (api userApi) GetByID(ctx *fiber.Ctx) error {
	id, err := strconv.Atoi(ctx.Params("id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(dto.Response{
			Message: err.Error(),
		})
	}
	user, err := api.userService.GetByID(int64(id))
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(dto.Response{
			Message: err.Error(),
		})
	}
	return ctx.Status(fiber.StatusOK).JSON(dto.ResponseData{
		Data: user,
	})
}
