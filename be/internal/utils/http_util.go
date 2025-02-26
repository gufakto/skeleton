package utils

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/gufakto/cms/domain"
	"github.com/gufakto/cms/dto"
	"github.com/gufakto/cms/internal/config"
	"github.com/lib/pq"
)

func GetHttpStatus(err error) int {
	switch {
	case errors.Is(err, dto.ErrAuthFailed):
		return 401
	case errors.Is(err, dto.ErrUsernameTaken):
		return 400
	case errors.Is(err, dto.ErrOTPInvalid):
		return 400
	case errors.Is(err, dto.ErrEmailRequired):
		return 422
	case errors.Is(err, dto.ErrPasswordRequired):
		return 422
	case errors.Is(err, dto.ErrInvalidEmail):
		return 422
	case errors.Is(err, dto.ErrInvalidPassword):
		return 422
	default:
		return 500
	}
}

// SSE
type Notification struct {
	ID int `json:"id"`
}

func ListenForNotificationTriggerFromDatabase(cnf *config.Config, conn *sql.DB) {
	// Create a new listener
	dsn := fmt.Sprintf(
		"host=%s "+
			"port=%s "+
			"user=%s "+
			"password=%s "+
			"dbname=%s "+
			"sslmode=disable",
		cnf.Database.Host,
		cnf.Database.Port,
		cnf.Database.Username,
		cnf.Database.Password,
		cnf.Database.DbName)
	listener := pq.NewListener(dsn, 10*time.Second, time.Minute, nil)
	if err := listener.Listen("notification_channel"); err != nil {
		log.Fatal("❌ Failed to listen to channel:", err)
	}

	fmt.Println("✅ Listening for new notifications...")

	for {
		select {
		case n := <-listener.Notify:
			if n == nil {
				fmt.Println("⚠️  No notification received.")
				continue
			}

			fmt.Println("✅ Notification received:", n.Extra) // Debug log

			// Parse JSON payload
			var data Notification
			err := json.Unmarshal([]byte(n.Extra), &data)
			if err != nil {
				log.Println("❌ Error parsing JSON:", err)
				continue
			}

			// Print received ID
			fmt.Printf("🚀 New notification received! ID: %d\n", data.ID)
		case <-time.After(30 * time.Second):
			fmt.Println("⏳ Waiting for notifications...")
		}
	}
}

// Convert Menu slice to MenuRes hierarchy
func BuildMenuTree(menus []domain.Menu) []*dto.MenuRes {
	// Map for quick lookup
	menuMap := make(map[int64]*dto.MenuRes)

	// Convert Menu to MenuRes and store in map
	for _, menu := range menus {
		menuMap[menu.ID] = &dto.MenuRes{
			ID:          menu.ID,
			Name:        menu.Name,
			Description: menu.Description,
			Icon:        menu.Icon,
			ParentID:    menu.ParentID,
			CreatedAt:   menu.CreatedAt,
			UpdatedAt:   menu.UpdatedAt,
			Childs:      []*dto.MenuRes{},
		}
	}

	// Root menus slice
	var rootMenus []*dto.MenuRes

	// Build parent-child relationships
	for _, menu := range menuMap {
		if menu.ParentID == 0 {
			// Root menu
			rootMenus = append(rootMenus, menu)
		} else {
			// Add as child to its parent if exists
			if parent, exists := menuMap[menu.ParentID]; exists {
				// fmt.Println("PARENT", parent)
				// fmt.Println("CHILD", menu)
				parent.Childs = append(parent.Childs, menu)

			}
		}
	}

	return rootMenus
}
