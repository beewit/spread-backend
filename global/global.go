package global

import (
	"github.com/beewit/beekit/conf"
	"github.com/beewit/beekit/utils/convert"
	"fmt"
	"github.com/beewit/beekit/mysql"
	"github.com/beewit/beekit/redis"
	"github.com/astaxie/beego/logs"
	"github.com/beewit/beekit/log"
)

var (
	CFG      conf.Config
	DB       *mysql.SqlConnPool
	RD       *redis.RedisConnPool
	Log      *logs.BeeLogger
	IP       string
	Port     string
	Host     string
	FileConf *fileConf
)

func init() {
	CFG = conf.New("config.json")
	DB = mysql.DB
	RD = redis.Cache
	Log = log.Logger
	IP = convert.ToString(CFG.Get("server.ip"))
	Port = convert.ToString(CFG.Get("server.port"))
	Host = fmt.Sprintf("http://%v:%v", IP, Port)

	FileConf = &fileConf{
		BasePath: convert.ToString(CFG.Get("files.basePath")),
		Path:     convert.ToString(CFG.Get("files.path")),
		DoMain:   convert.ToString(CFG.Get("files.doMain")),
	}
}

type fileConf struct {
	BasePath string
	Path     string
	DoMain   string
}
