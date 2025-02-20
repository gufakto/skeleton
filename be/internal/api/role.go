package api

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/gufakto/cms/domain"
	"github.com/gufakto/cms/dto"
)

type roleApi struct {
	roleService domain.RoleService
}

func NewRole(app *fiber.App, roleService domain.RoleService, authMid fiber.Handler) {
	api := roleApi{
		roleService: roleService,
	}
	app.Get("/v1/admin/role", authMid, api.GetAll)
	app.Post("/v1/admin/role", authMid, api.Create)
	app.Get("/v1/admin/role/:id", authMid, api.GetByID)
	app.Put("/v1/admin/role/:id", authMid, api.Update)
	app.Delete("/v1/admin/role/:id", authMid, api.Delete)
}

func (api *roleApi) GetAll(ctx *fiber.Ctx) error {
	page := ctx.QueryInt("page", 1)
	limit := ctx.QueryInt("limit", 10)
	res, err := api.roleService.FindAll(page, limit)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(dto.Response{
			Message: err.Error(),
		})
	}
	return ctx.Status(fiber.StatusOK).JSON(dto.ResponsePaginate{
		Data:  res,
		Page:  page,
		Limit: limit,
		Total: len(res),
	})
}

func (api *roleApi) Create(ctx *fiber.Ctx) error {
	req := new(dto.RoleReq)
	if err := ctx.BodyParser(req); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(dto.Response{
			Message: err.Error(),
		})
	}
	if err := req.Validate(); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(dto.Response{
			Message: err.Error(),
		})
	}

	err := api.roleService.Create(req)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(dto.Response{
			Message: err.Error(),
		})
	}
	return ctx.Status(fiber.StatusCreated).JSON(dto.Response{
		Message: "success",
	})
}

func (api *roleApi) GetByID(ctx *fiber.Ctx) error {
	id, err := strconv.Atoi(ctx.Params("id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(dto.Response{
			Message: err.Error(),
		})
	}
	res, err := api.roleService.FindByID(int64(id))
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(dto.Response{
			Message: err.Error(),
		})
	}
	return ctx.Status(fiber.StatusOK).JSON(dto.ResponseData{
		Data: res,
	})
}

func (api *roleApi) Update(ctx *fiber.Ctx) error {
	id, err := strconv.Atoi(ctx.Params("id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(dto.Response{
			Message: err.Error(),
		})
	}
	req := new(dto.RoleReq)
	if err := ctx.BodyParser(req); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(dto.Response{
			Message: err.Error(),
		})
	}
	if err := req.Validate(); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(dto.Response{
			Message: err.Error(),
		})
	}
	err = api.roleService.Update(int64(id), req)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(dto.Response{
			Message: err.Error(),
		})
	}
	return ctx.Status(fiber.StatusOK).JSON(dto.Response{
		Message: "success",
	})
}

func (api *roleApi) Delete(ctx *fiber.Ctx) error {
	id, err := strconv.Atoi(ctx.Params("id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(dto.Response{
			Message: err.Error(),
		})
	}
	err = api.roleService.Delete(int64(id))
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(dto.Response{
			Message: err.Error(),
		})
	}
	return ctx.Status(fiber.StatusOK).JSON(dto.Response{
		Message: "success",
	})
}
