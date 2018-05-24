package router

import (
	"fmt"
	"github.com/labstack/echo/middleware"
	"github.com/labstack/echo"
	"github.com/beewit/beekit/utils/convert"
	"github.com/beewit/spread-backend/global"
	"github.com/beewit/beekit/utils"
	"github.com/beewit/spread-backend/handler"
)

func Start() {
	fmt.Printf("用户后台管理系统启动")
	e := echo.New()
	e.Use(middleware.Gzip())
	e.Use(middleware.Recover())
	e.Static("/page", "page")
	e.File("/", "page/index.html")
	e.POST("/api/sys/check/role", handler.CheckRole, handler.Filter)
	e.POST("/api/account/list/org", handler.GetAccountListByOrg, handler.Filter)
	e.POST("/api/account/add", handler.AddAccount, handler.Filter)
	e.POST("/api/account/paste/import", handler.PasteImportAccount, handler.Filter)
	e.POST("/api/advert/list", handler.GetAccountAdvertList, handler.Filter)
	e.POST("/api/advert/del", handler.DelAccountAdvert, handler.Filter)
	e.POST("/api/advert/get", handler.GetAccountAdvert, handler.Filter)
	e.POST("/api/advert/edit", handler.EditAccountAdvert, handler.Filter)
	e.POST("/api/advert/check/log", handler.GetCheckAdvertLogList, handler.Filter)

	utils.Open(global.Host)
	port := ":" + convert.ToString(global.Port)
	e.Logger.Fatal(e.Start(port))
}
