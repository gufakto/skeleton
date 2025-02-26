package dto

type MenuRes struct {
	ID          int64      `json:"id"`
	Name        string     `json:"name"`
	Description string     `json:"description"`
	ParentID    int64      `json:"parent_id"`
	Icon        string     `json:"icon"`
	Childs      []*MenuRes `json:"childs"`
	CreatedAt   string     `json:"created_at"`
	UpdatedAt   string     `json:"updated_at"`
}
