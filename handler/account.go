package handler

import (
	"github.com/labstack/echo"
	"github.com/beewit/beekit/utils"
	"github.com/beewit/spread-backend/global"
	"strings"
	"github.com/beewit/beekit/utils/enum"
	"github.com/beewit/beekit/utils/encrypt"
	"time"
	"fmt"
	"math/rand"
)

/**
	账号管理权限
 */
func CheckRole(c echo.Context) error {
	acc, err := GetAccount(c)
	if err != nil {
		return err
	}
	org, err := GetOrg(c)
	if err != nil {
		return err
	}
	return utils.SuccessNullMsg(c, map[string]interface{}{
		"account": acc,
		"org":     org,
	})
}

/**
	获取组织下的人员
 */
func GetAccountListByOrg(c echo.Context) error {
	org, err := GetOrg(c)
	if err != nil {
		return err
	}
	var where string
	keyword := strings.Trim(c.FormValue("keyword"), "")
	if keyword != "" {
		where += " AND (nickname LIKE '%" + keyword + "%' OR mobile LIKE '%" + keyword + "%')"
	}
	pageIndex := utils.GetPageIndex(c.FormValue("pageIndex"))
	pageSize := utils.GetPageSize(c.FormValue("pageSize"))
	page, err := global.DB.QueryPage(&utils.PageTable{
		Fields:    "id,photo,nickname,gender,mobile",
		Table:     "account",
		Where:     "status=? AND org_id=?" + where,
		PageIndex: pageIndex,
		PageSize:  pageSize,
		Order:     "ct_time DESC",
	}, enum.NORMAL, org.ID)
	if err != nil {
		global.Log.Error("GetAccountListByOrg sql error：%s", err.Error())
		return utils.Error(c, "数据异常，"+err.Error(), nil)
	}
	if page == nil {
		return utils.NullData(c)
	}
	return utils.Success(c, "获取数据成功", page)
}

func AddAccount(c echo.Context) error {
	org, err := GetOrg(c)
	if err != nil {
		return err
	}
	nickname := c.FormValue("nickname")
	mobile := c.FormValue("mobile")
	gender := c.FormValue("gender")
	photo := c.FormValue("photo")
	email := c.FormValue("email")
	dateOfBirth := c.FormValue("date_of_birth")
	password := c.FormValue("password")
	remark := c.FormValue("remark")
	if nickname == "" {
		return utils.ErrorNull(c, "请输入名称")
	}
	if len(nickname) > 50 {
		return utils.ErrorNull(c, "名称过长")
	}
	if password != "" {
		if len(password) > 16 {
			return utils.ErrorNull(c, "登陆密码最长不能超过16位")
		}
		if !utils.CheckRegexp(password, "^[0-9a-z]{6,16}$") {
			return utils.ErrorNull(c, "登陆密码仅包含字母数字字符")
		}
	} else {
		password = "666666"
	}
	if gender != enum.GENDER_MALE && gender != enum.GENDER_FEMALE {
		gender = enum.GENDER_UNKNOWN
	}

	if !utils.CheckMobile(mobile) {
		return utils.ErrorNull(c, "手机号码格式错误")
	}
	if email != "" && !utils.CheckEmail(email) {
		return utils.ErrorNull(c, "邮箱格式错误")
	}
	if dateOfBirth != "" && !utils.IsValidDate(dateOfBirth) {
		return utils.ErrorNull(c, "生日格式错误")
	}
	if !CheckMobile(mobile) {
		return utils.ErrorNull(c, "手机号码已存在")
	}
	accountId := utils.ID()
	smsCode := GetRand()
	sql := "INSERT INTO account (id,mobile,password,salt,status,ct_time,ct_ip,nickname,photo,gender,org_id,date_of_birth,email,remark,source_channel) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
	_, err = global.DB.Insert(sql, accountId, mobile, encrypt.Sha1Encode(password+smsCode), smsCode, enum.NORMAL,
		utils.CurrentTime(), c.RealIP(), nickname, photo, gender, org.ID, dateOfBirth, email, remark, "org")
	if err != nil {
		global.Log.Error("AddAccount sql error：%s", err.Error())
		return utils.Error(c, "保存失败，"+err.Error(), nil)
	}
	return utils.SuccessNull(c, "保存成功")
}

func GetRand() string {
	rnd := rand.New(rand.NewSource(time.Now().UnixNano()))
	return fmt.Sprintf("%04v", rnd.Int31n(10000))
}

/**
	检查手机号码
 */
func CheckMobileExist(c echo.Context) error {
	mobile := c.FormValue("mobile")
	if !utils.CheckMobile(mobile) {
		return utils.Error(c, "手机号码格式错误", nil)
	}

	return utils.SuccessNullMsg(c, CheckMobile(mobile))
}

func CheckMobile(mobile string) bool {
	if mobile == "" {
		return false
	}
	sql := `SELECT mobile FROM account WHERE mobile = ? `
	rows, err := global.DB.Query(sql, mobile)
	if err != nil {
		return false
	}
	if len(rows) >= 1 {
		return true
	}
	return false
}
