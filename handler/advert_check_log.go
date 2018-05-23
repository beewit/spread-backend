package handler

import (
	"github.com/labstack/echo"
	"github.com/beewit/spread-backend/global"
	"github.com/beewit/beekit/utils"
)

/**
	管理的广告
 */
func GetCheckAdvertLogList(c echo.Context) error {
	acc, err := GetAccount(c)
	if err != nil {
		return err
	}
	advertId := c.FormValue("id")
	sql := "SELECT acc.nickname,acc.mobile,log.check_time FROM account acc LEFT JOIN account_advert_check_log log ON log.account_id=acc.id AND log.account_advert_id=? WHERE acc.org_id=?"
	m, err := global.DB.Query(sql, advertId, acc.OrgId)
	if err != nil {
		return utils.ErrorNull(c, "获取记录失败")
	}
	return utils.Success(c, "获取数据成功", m)
}
