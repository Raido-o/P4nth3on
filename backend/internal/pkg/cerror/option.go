package cerror

import "fmt"

type Option func(*Error)

func WithInternalCode() Option {
	return func(e *Error) {
		e.code = Internal
	}
}

func WithInvalidArgumentCode() Option {
	return func(e *Error) {
		e.code = InvalidArgument
	}
}

func WithNotFoundCode() Option {
	return func(e *Error) {
		e.code = NotFound
	}
}

func WithAlreadyExistsCode() Option {
	return func(e *Error) {
		e.code = AlreadyExists
	}
}

func WithUnauthorizedCode() Option {
	return func(e *Error) {
		e.code = Unauthorized
	}
}

func WithForbiddenCode() Option {
	return func(e *Error) {
		e.code = Forbidden
	}
}

func WithPostgreSQLCode() Option {
	return func(e *Error) {
		e.code = PostgreSQL
	}
}

func WithNoRowsCode() Option {
	return func(e *Error) {
		e.code = NoRows
	}
}

func WithClientMsg(format string, args ...any) Option {
	return func(e *Error) {
		e.clientMsg = fmt.Sprintf(format, args...)
	}
}
