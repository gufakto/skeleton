package dto

type Response struct {
	Message string `json:"message"`
}
type ResponsePaginate struct {
	Data  interface{} `json:"data"`
	Page  int         `json:"page"`
	Limit int         `json:"limit"`
	Total int         `json:"total"`
}

type ResponseData struct {
	Data interface{} `json:"data"`
}
