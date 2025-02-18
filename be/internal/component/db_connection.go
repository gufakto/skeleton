package component

import (
	"fmt"
	"log"

	"github.com/gufakto/cms/domain"
	"github.com/gufakto/cms/internal/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectDB(cnf *config.Config) *gorm.DB {
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
	fmt.Printf("dsn: %s", cnf.Database)
	conn, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err.Error())
	}
	migrate(conn)
	return conn
	// db, err := conn.DB()
	// if err != nil {
	// 	log.Fatal(err.Error())
	// }
	// return db
}

func migrate(conn *gorm.DB) {
	conn.AutoMigrate(
		domain.User{},
		domain.Role{},
		domain.UserRole{},
		domain.Menu{},
		domain.RoleMenu{},
	)
}
