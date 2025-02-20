package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gufakto/cms/internal/api"
	"github.com/gufakto/cms/internal/component"
	"github.com/gufakto/cms/internal/config"
	"github.com/gufakto/cms/internal/middleware"
	"github.com/gufakto/cms/internal/repository"
	"github.com/gufakto/cms/internal/service"
)

func main() {
	// CONNECTION
	cnf := config.Get()
	dbConnection := component.ConnectDB(cnf)

	// REPOSITORY
	userRepository := repository.NewUser(dbConnection)
	roleRepository := repository.NewRole(dbConnection)

	// SERVICES
	userService := service.NewUser(userRepository)
	authService := service.NewAuth(userRepository, cnf)
	roleService := service.NewRole(roleRepository)

	authMid := middleware.Authenticate(cnf)

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization, Content-Length, X-Requested-With",
		AllowMethods: "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",
	}))
	api.NewUser(app, userService, authMid)
	api.NewAuth(app, authService)
	api.NewRole(app, roleService, authMid)

	app.Listen(cnf.Server.Host + ":" + cnf.Server.Port)
}
