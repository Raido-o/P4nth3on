package public

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestCreateUser_Success(t *testing.T) {
	uid := fmt.Sprintf("uid_%d", time.Now().UnixNano())
	email := "create_test@example.com"
	name := "テストユーザー"

	body, _ := json.Marshal(map[string]string{"name": name})
	req := httptest.NewRequest(http.MethodPost, "/v1/users", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set(testUIDHeader, uid)
	req.Header.Set(testEmailHeader, email)
	rec := httptest.NewRecorder()

	echoServer.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusCreated, rec.Code, rec.Body.String())

	var resp map[string]any
	err := json.NewDecoder(rec.Body).Decode(&resp)
	assert.NoError(t, err)
	assert.Equal(t, uid, resp["id"])
	assert.Equal(t, email, resp["email"])
	assert.Equal(t, name, resp["name"])
}

func TestCreateUser_Unauthorized(t *testing.T) {
	body, _ := json.Marshal(map[string]string{"name": "テスト"})
	req := httptest.NewRequest(http.MethodPost, "/v1/users", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	// UIDヘッダーなし（未認証）
	rec := httptest.NewRecorder()

	echoServer.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusUnauthorized, rec.Code, rec.Body.String())
}

func TestCreateUser_Duplicate(t *testing.T) {
	uid := fmt.Sprintf("uid_dup_%d", time.Now().UnixNano())
	email := "dup@example.com"

	body, _ := json.Marshal(map[string]string{"name": "最初のユーザー"})

	// 1回目
	req1 := httptest.NewRequest(http.MethodPost, "/v1/users", bytes.NewReader(body))
	req1.Header.Set("Content-Type", "application/json")
	req1.Header.Set(testUIDHeader, uid)
	req1.Header.Set(testEmailHeader, email)
	rec1 := httptest.NewRecorder()
	echoServer.ServeHTTP(rec1, req1)
	assert.Equal(t, http.StatusCreated, rec1.Code)

	// 2回目（同じUID）
	body2, _ := json.Marshal(map[string]string{"name": "重複ユーザー"})
	req2 := httptest.NewRequest(http.MethodPost, "/v1/users", bytes.NewReader(body2))
	req2.Header.Set("Content-Type", "application/json")
	req2.Header.Set(testUIDHeader, uid)
	req2.Header.Set(testEmailHeader, "other@example.com")
	rec2 := httptest.NewRecorder()
	echoServer.ServeHTTP(rec2, req2)

	assert.Equal(t, http.StatusConflict, rec2.Code, rec2.Body.String())
}

func TestGetMe_Success(t *testing.T) {
	uid := fmt.Sprintf("uid_getme_%d", time.Now().UnixNano())
	email := "getme@example.com"
	name := "GetMeユーザー"

	// まずユーザーを作成
	body, _ := json.Marshal(map[string]string{"name": name})
	req := httptest.NewRequest(http.MethodPost, "/v1/users", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set(testUIDHeader, uid)
	req.Header.Set(testEmailHeader, email)
	rec := httptest.NewRecorder()
	echoServer.ServeHTTP(rec, req)
	assert.Equal(t, http.StatusCreated, rec.Code)

	// GetMe
	req2 := httptest.NewRequest(http.MethodGet, "/v1/users/me", nil)
	req2.Header.Set(testUIDHeader, uid)
	req2.Header.Set(testEmailHeader, email)
	rec2 := httptest.NewRecorder()
	echoServer.ServeHTTP(rec2, req2)

	assert.Equal(t, http.StatusOK, rec2.Code, rec2.Body.String())

	var resp map[string]any
	err := json.NewDecoder(rec2.Body).Decode(&resp)
	assert.NoError(t, err)
	assert.Equal(t, uid, resp["id"])
	assert.Equal(t, email, resp["email"])
	assert.Equal(t, name, resp["name"])
}

func TestGetMe_NotFound(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/v1/users/me", nil)
	req.Header.Set(testUIDHeader, fmt.Sprintf("nonexistent_%d", time.Now().UnixNano()))
	req.Header.Set(testEmailHeader, "none@example.com")
	rec := httptest.NewRecorder()

	echoServer.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusNotFound, rec.Code, rec.Body.String())
}

func TestGetMe_Unauthorized(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/v1/users/me", nil)
	// UIDヘッダーなし
	rec := httptest.NewRecorder()

	echoServer.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusUnauthorized, rec.Code, rec.Body.String())
}
