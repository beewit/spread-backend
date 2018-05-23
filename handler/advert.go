package handler

import (
	"github.com/labstack/echo"
	"github.com/beewit/beekit/utils"
	"github.com/beewit/spread-backend/global"
	"github.com/beewit/beekit/utils/enum"
	"strings"
	"github.com/beewit/beekit/utils/convert"
)

/**
	管理的广告
 */
func GetAccountAdvertList(c echo.Context) error {
	_, err := GetAccount(c)
	if err != nil {
		return err
	}
	org, err := GetOrg(c)
	if err != nil {
		return err
	}
	var where string
	keyword := strings.Trim(c.FormValue("keyword"), "")
	if keyword != "" {
		where += " AND (title LIKE '%" + keyword + "%' OR content LIKE '%" + keyword + "%')"
	}
	pageIndex := utils.GetPageIndex(c.FormValue("pageIndex"))
	pageSize := utils.GetPageSize(c.FormValue("pageSize"))
	page, err := global.DB.QueryPage(&utils.PageTable{
		Fields:    "*,(SELECT count(1) FROM account_advert_check_log log WHERE log.account_advert_id=account_advert.id) as sendCount",
		Table:     "account_advert",
		Where:     "status=? AND org_id=?" + where,
		PageIndex: pageIndex,
		PageSize:  pageSize,
		Order:     "ct_time DESC",
	}, enum.NORMAL, org.ID)
	if err != nil {
		global.Log.Error("GetAccountAdvertList sql error：%s", err.Error())
		return utils.Error(c, "数据异常，"+err.Error(), nil)
	}
	if page == nil {
		return utils.NullData(c)
	}
	return utils.Success(c, "获取数据成功", page)
}

/**
	删除广告
 */
func DelAccountAdvert(c echo.Context) error {
	_, err := GetAccount(c)
	if err != nil {
		return err
	}
	org, err := GetOrg(c)
	if err != nil {
		return err
	}
	id := strings.TrimSpace(c.FormValue("id"))
	if id == "" || !utils.IsValidNumber(id) {
		return utils.ErrorNull(c, "id格式错误")
	}
	m := getAccountAdvert(convert.MustInt64(id))
	if m == nil {
		return utils.ErrorNull(c, "数据不存在")
	}
	if convert.MustInt64(m["org_id"]) != org.ID {
		return utils.ErrorNull(c, "无权限删除此数据")
	}
	x, err := global.DB.Update("UPDATE account_advert SET status=? WHERE id=?", enum.DELETE, id)
	if err != nil {
		global.Log.Error("DelAccountAdvert sql error：%s", err.Error())
		return utils.ErrorNull(c, "删除失败")
	}
	if x > 0 {
		return utils.SuccessNull(c, "删除成功")
	}
	return utils.ErrorNull(c, "删除失败")
}

func getAccountAdvert(id int64) map[string]interface{} {
	if id < 1 {
		return nil
	}
	rows, err := global.DB.Query("SELECT * FROM account_advert WHERE id=? LIMIT 1", id)
	if err != nil {
		global.Log.Error("getAccountAdvert sql error：%s", err.Error())
		return nil
	}
	if len(rows) != 1 {
		return nil
	}
	return rows[0]
}

/**
	获取广告信息
 */
func GetAccountAdvert(c echo.Context) error {
	org, err := GetOrg(c)
	if err != nil {
		return err
	}
	id := strings.TrimSpace(c.FormValue("id"))
	if id == "" || !utils.IsValidNumber(id) {
		return utils.ErrorNull(c, "id格式错误")
	}
	m := getAccountAdvert(convert.MustInt64(id))
	if m == nil {
		return utils.ErrorNull(c, "数据不存在")
	}
	if convert.MustInt64(m["org_id"]) != org.ID {
		return utils.ErrorNull(c, "无权限访问此数据")
	}
	return utils.SuccessNullMsg(c, m)
}

/**
	添加广告
 */
func EditAccountAdvert(c echo.Context) error {
	acc, err := GetAccount(c)
	if err != nil {
		return err
	}
	org, err := GetOrg(c)
	if err != nil {
		return err
	}
	id := c.FormValue("id")
	title := c.FormValue("title")
	content := c.FormValue("content")
	img := c.FormValue("img")
	if title == "" {
		return utils.ErrorNull(c, "请输入广告标题")
	}
	if len(title) >= 200 {
		return utils.ErrorNull(c, "广告标题过长")
	}
	if content == "" {
		return utils.ErrorNull(c, "请输入广告内容")
	}
	t := enum.ACCOUNT_ADVERT_IMG_TEXT
	if img == "" {
		t = enum.ACCOUNT_ADVERT_TEXT
	}
	nowTime := utils.CurrentTime()
	m := getAccountAdvert(convert.MustInt64(id))
	if m == nil {
		_, err = global.DB.InsertMap("account_advert", map[string]interface{}{
			"id":         utils.ID(),
			"account_id": acc.ID,
			"type":       t,
			"title":      title,
			"content":    content,
			"img":        img,
			"status":     enum.NORMAL,
			"ct_time":    nowTime,
			"ut_time":    nowTime,
			"ip":         c.RealIP(),
			"org_id":     org.ID,
		})
		if err != nil {
			global.Log.Error("AddAccountAdvert sql add error：", err.Error())
			return utils.ErrorNull(c, "保存失败")
		}
	} else {
		if convert.MustInt64(m["org_id"]) != org.ID {
			return utils.ErrorNull(c, "无权限修改")
		}
		_, err := global.DB.Update("UPDATE account_advert SET title=?,content=?,img=? WHERE id=?", title, content, img, id)
		if err != nil {
			global.Log.Error("AddAccountAdvert sql update error：", err.Error())
			return utils.ErrorNull(c, "保存失败")
		}
	}
	return utils.SuccessNull(c, "保存成功")
}