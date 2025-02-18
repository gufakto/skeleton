package main

import (
	"fmt"
	"log"

	"github.com/gufakto/cms/internal/component"
	"github.com/gufakto/cms/internal/config"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	fmt.Println("seed data user into users table")
	cnf := config.Get()
	dbConnection := component.ConnectDB(cnf)

	db, err := dbConnection.DB()
	if err != nil {
		panic(err)
	}
	hasPass, _ := bcrypt.GenerateFromPassword([]byte("qwe123qwe"), 12)
	sqlStatement := `
		INSERT INTO users (name, email, password, created_at, updated_at)
		VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id`
	var userID int64
	err = db.QueryRow(sqlStatement, "admin", "admin@gmail.com", hasPass).Scan(&userID)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("inserted user id : ", userID)
}
