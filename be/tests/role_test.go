package tests

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/gufakto/cms/domain"
	"github.com/gufakto/cms/dto"
	"github.com/gufakto/cms/internal/api"
	"github.com/gufakto/cms/internal/component"
	"github.com/gufakto/cms/internal/config"
	"github.com/gufakto/cms/internal/middleware"
	"github.com/gufakto/cms/internal/repository"
	"github.com/gufakto/cms/internal/service"
	"github.com/gufakto/cms/internal/utils"
	"github.com/stretchr/testify/assert"
)

func newTestRole() (*fiber.App, domain.RoleService, string, *config.Config) {
	cnf := Get()
	dbConn := component.ConnectDB(cnf)
	roleRepo := repository.NewRole(dbConn)
	roleService := service.NewRole(roleRepo)
	app := fiber.New()
	token, _ := utils.GenerateToken("admin@gmail.com", cnf)
	return app, roleService, token.Token, cnf

}
func TestCreateRole(t *testing.T) {
	app, roleService, token, cnf := newTestRole()
	authMid := middleware.Authenticate(cnf)
	api.NewRole(app, roleService, authMid)
	body := `{
		"name": "EDITOR",
		"description": "Super Admin",
		"type": "admin"
	}`

	req := httptest.NewRequest("POST", "/v1/admin/role", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")

	req.Header.Set("Authorization", "Bearer "+token)

	resp, _ := app.Test(req)
	assert.Equal(t, http.StatusCreated, resp.StatusCode)
}

func TestDeleteRole(t *testing.T) {
	app, roleService, token, cnf := newTestRole()
	authMid := middleware.Authenticate(cnf)
	api.NewRole(app, roleService, authMid)
	req := httptest.NewRequest("DELETE", "/v1/admin/role/21", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	resp, _ := app.Test(req)
	assert.Equal(t, http.StatusOK, resp.StatusCode)
}

func TestGetAllRole(t *testing.T) {
	app, roleService, token, cnf := newTestRole()
	authMid := middleware.Authenticate(cnf)
	api.NewRole(app, roleService, authMid)
	req := httptest.NewRequest("GET", "/v1/admin/role", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	resp, _ := app.Test(req)
	var response dto.ResponsePaginate
	json.NewDecoder(resp.Body).Decode(&response)
	var data []dto.RoleRes
	if dataSlice, ok := response.Data.([]interface{}); ok {
		for _, v := range dataSlice {
			if roleData, ok := v.(map[string]interface{}); ok {
				var roleRes dto.RoleRes
				jsonData, _ := json.Marshal(roleData)
				json.Unmarshal(jsonData, &roleRes)
				data = append(data, roleRes)
			}
		}
	}
	defer resp.Body.Close()
	assert.Equal(t, 2, len(data))
}
