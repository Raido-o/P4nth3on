package cerror

import "net/http"

// Code represents Error Code
type Code int

func (c Code) String() string {
	return codeMap[c].message
}

const (
	OK Code = iota
	NotFound
	InvalidArgument
	Forbidden
	Unauthorized
	Internal
	AlreadyExists
	PostgreSQL
	Unknown
	NoRows
	Transaction
)

type codeDetail struct {
	message    string
	httpStatus int
}

var codeMap = map[Code]codeDetail{
	OK:              {"OK", http.StatusOK},
	NotFound:        {"Not found", http.StatusNotFound},
	InvalidArgument: {"Invalid argument", http.StatusBadRequest},
	Forbidden:       {"Forbidden", http.StatusForbidden},
	Unauthorized:    {"Unauthorized", http.StatusUnauthorized},
	Internal:        {"Internal", http.StatusInternalServerError},
	AlreadyExists:   {"Already exists", http.StatusConflict},
	Unknown:         {"Unknown", http.StatusInternalServerError},
	PostgreSQL:      {"Postgres", http.StatusInternalServerError},
	NoRows:          {"No rows", http.StatusNotFound},
	Transaction:     {"Transaction", http.StatusInternalServerError},
}

func MapHTTPErrorToCode(httpStatusCode int) Code {
	switch httpStatusCode {
	case http.StatusOK:
		return OK
	case http.StatusNotFound:
		return NotFound
	case http.StatusBadRequest:
		return InvalidArgument
	case http.StatusForbidden:
		return Forbidden
	case http.StatusUnauthorized:
		return Unauthorized
	case http.StatusInternalServerError:
		return Internal
	default:
		return Unknown
	}
}
