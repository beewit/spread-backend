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
	"github.com/beewit/beekit/utils/convert"
	"github.com/beewit/beekit/mysql"
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

func PasteImportAccount(c echo.Context) error {
	org, err := GetOrg(c)
	if err != nil {
		return err
	}
	//是否为校验数
	debug := convert.MustBool(c.FormValue("debug"))
	//json数据
	json := c.FormValue("json")
	if json == "" {
		return utils.ErrorNull(c, "无可导入数据")
	}
	dataMap, err := convert.String2MapList(json)
	if err != nil {
		return utils.ErrorNull(c, "数据格式错误")
	}
	if dataMap == nil {
		return utils.ErrorNull(c, "未识别有效数据")
	}
	var mobiles = make([]string, len(dataMap))
	var mobile, nickname, gender string
	for key, value := range dataMap {
		nickname = convert.ToString(value["nickname"])
		mobile = convert.ToString(value["mobile"])
		gender = convert.ToString(value["gender"])
		if nickname != "" && len(nickname) > 50 {
			return utils.ErrorNull(c, "姓名过长")
		}
		if nickname != "" && gender != enum.GENDER_MALE && gender != enum.GENDER_FEMALE {
			return utils.ErrorNull(c, "性别仅支持男、女")
		}
		if mobile != "" && utils.CheckMobile(mobile) {
			mobiles[key] = mobile
		} else {
			//手机格式错误
			return utils.Success(c, "手机格式错误", map[string]interface{}{
				"data":  "mobile",
				"order": key,
			})
		}
	}
	//查询存在的手机号码
	existMobileMap, err := global.DB.Query(fmt.Sprintf("SELECT mobile FROM account WHERE mobile IN (%s)", strings.Join(mobiles, ",")))
	if err != nil {
		return utils.ErrorNull(c, "查询手机号码重复性失败")
	}

	var msg string
	if existMobileMap != nil {
		mobiles = make([]string, len(existMobileMap))
		for key, value := range existMobileMap {
			mobile = convert.ToString(value["mobile"])
			mobiles[key] = mobile
		}
		msg = "，手机号码：" + strings.Join(mobiles, ",") + "，已存在将不会修改原有的名称、性别！"
	} else {
		mobiles = nil
	}
	if debug {
		return utils.SuccessNull(c, "检验通过！"+msg)
	} else {
		//添加数据
		//进行注册
		sql := "INSERT INTO account (id,mobile,password,salt,status,ct_time,ct_ip,nickname,gender,org_id,source_channel) VALUES (?,?,?,?,?,?,?,?,?,?,?)"
		var accId int64
		var salt string
		var flag = true
		global.DB.Tx(func(tx *mysql.SqlConnTransaction) {
			for _, value := range dataMap {
				mobile = convert.ToString(value["mobile"])
				nickname = convert.ToString(value["nickname"])
				if utils.Contains(mobiles, mobile) {
					continue
				}
				accId = utils.ID()
				salt = GetRand()
				_, err = tx.Insert(sql, accId, mobile, encrypt.Sha1Encode("666666"+salt), salt, enum.NORMAL, utils.CurrentTime(), c.RealIP(), nickname, gender, org.ID, "org")
				if err != nil {
					panic(err)
				}
			}
			//将已存在的手机号码，修改所属组织
			if mobiles != nil {
				_, err := tx.Update(fmt.Sprintf("UPDATE account SET org_id=? WHERE mobile IN (%s)", strings.Join(mobiles, ",")), org.ID)
				if err != nil {
					panic(err)
				}
			}
		}, func(err error) {
			if err != nil {
				global.Log.Error("PasteImportAccount sql error：%s", err.Error())
				flag = false
			}
		})

		if flag {
			return utils.SuccessNull(c, "导入完成")
		}
		return utils.ErrorNull(c, "导入失败")
	}
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

	if CheckMobile(mobile) {
		//修改信息
		_, err := global.DB.Update("UPDATE account SET org_id=? WHERE mobile=?", org.ID, mobile)
		if err != nil {
			global.Log.Error("AddAccount update sql error：%s", err.Error())
			return utils.Error(c, "保存失败，"+err.Error(), nil)
		}
		return utils.SuccessNull(c, "加入组织成功，但因账号已存在无法修改其他信息")
	} else {
		accountId := utils.ID()
		smsCode := GetRand()
		sql := "INSERT INTO account (id,mobile,password,salt,status,ct_time,ct_ip,nickname,photo,gender,org_id,date_of_birth,email,remark,source_channel) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
		_, err = global.DB.Insert(sql, accountId, mobile, encrypt.Sha1Encode(password+smsCode), smsCode, enum.NORMAL,
			utils.CurrentTime(), c.RealIP(), nickname, photo, gender, org.ID, dateOfBirth, email, remark, "org")
		if err != nil {
			global.Log.Error("AddAccount sql error：%s", err.Error())
			return utils.Error(c, "保存失败，"+err.Error(), nil)
		}
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
