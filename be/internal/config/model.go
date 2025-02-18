package config

type Config struct {
	Server   Server
	Database Database
	Email    Email
	Token    Token
}

type Server struct {
	Host string
	Port string
}

type Database struct {
	Host     string
	Port     string
	Username string
	Password string
	DbName   string
}

type Email struct {
	Host     string
	Port     string
	User     string
	Password string
}

type Token struct {
	TokenKey        string
	RefresTokenKey  string
	TokenExp        int
	RefreshTokenExp int
}
