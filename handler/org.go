package handler

import (
	"github.com/beewit/spread-backend/global"
	"github.com/beewit/beekit/utils/enum"
)

/**
	获取组织[公司]管理员
 */
func GetOrgByAccountId(accId int64) map[string]interface{} {
	m, err := global.DB.Query("SELECT * FROM org WHERE account_id=? AND type=? AND status=? LIMIT 1", accId, enum.COMPANY, enum.NORMAL)
	if err != nil {
		global.Log.Error("GetOrgByAccountId sql error：%s", err.Error())
		return nil
	}
	if len(m) != 1 {
		return nil
	}
	return m[0]
}
