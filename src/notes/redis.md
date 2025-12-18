---
title: Redis
---

# 概括

Redis 是一个开源的内存数据结构存储，用作数据库、缓存、消息代理和流引擎，Redis 是用 ANSI C 编写的，可以在大多数 POSIX 系统上运行，例如 Linux，没有外部依赖。

# 安装

- 通过源码安装

   如果没有安装 GCC 需要执行`yum install gcc-c++ -y`，如果环境缺少 GCC，使用`make`编译后报错，需要执行`make distclean`，然后再进行`make`编译。在 Redis 源码解压后的目录中运行：

   ```shell
   make & make install
   ```
   
- 通过`yum`安装

   ```shell
   yum install redis
   ```

# 启动

```shell
# 直接启动
redis-server
# 使用--port选项自定义端口，默认会使用6379端口
redis-server --port 6379
# 指定配置文件启动
redis-server /path/to/redis.conf
```

如果要停止 Redis，可以使用`redis-cli`发送`shutdown`，首先会断开所有客户端的连接，然后根据配置执行持久化，最后退出。

```shell
redis-cli shutdown
```

在源码目录的`utils`文件夹中有个一名为`redis_init_script`的初始化脚本文件，可以通过这个脚本来配置 Redis 随系统自动运行。将脚本复制到`/etc/init.d`目录下，修改名称为`redis`，进入`/etc/init.d`目录后执行`chkconfig redis on`，注册为系统服务。再将源码目录下的`redis.conf`复制到`/etc/redis`目录下，修改名称为`6379.conf`，修改文件中的配置如下：

```
# 已守护进程方式运行
daemonize yes
# 允许来自指定网卡的Redis请求，如果没有指定，就说明可以接受来自任意一个网卡的Redis请求
bind 127.0.0.1
# 关闭保护模式，允许其他机器连接Redis
protected-mode no
# 启用密码
requireroot <password>
```

然后通过命令来启动或者停止 Redis：

```shell
# 启动Redis服务
service redis start
# 停止Redis服务
service redis stop
```

# 连接

`redis-cli`是 Redis 自带的客户端，可以通过`redis-cli`向 Redis 发送各种命令。

```shell
# 按照默认配置连接进入交互式命令行，地址为127.0.0.1，端口为6379，-a选项表示输入密码
redis-cli
# 测试连接是否正常
redis-cli ping
# 关闭
redis-cli shutdown
```

如果需要外部客户端连接本机 Redis，需要开放系统防火墙端口：

```shell
# 查看永久开放的端口
firewall-cmd --list-ports --permanent
# 开放6379端口
firewall-cmd --add-port=6379/tcp --permanent
```

# 多数据库

Redis 提供了多个用来存储数据的字典，客户端可以指定将数据存储在哪个字典中，可以将每个字典理解为一个独立的数据库。每个数据库对外都是一个从0开始递增的数字命名，Redis 默认支持16个数据库，可以通过配置参数`databases`修改。客户端与 Redis 连接后默认会选择0号数据库，可以使用`select`来切换。

```shell
# 选择1号数据库
redis> select 1
```

> Redis 不支持自定义数据库的名字，开发者必须记录哪些数据库存储了哪些数据。这些数据库更像是一种命名空间，而不适合存储不同应用程序的数据。

# 命令

获取符合规则的键名列表：

```shell
keys <pattern>
```

> pattern 支持 glob 风格通配符格式，`?`表示匹配一个字符，`*`表示匹配任意个字符，`[]`表示匹配括号间的任意一个字符，`\`表示转义，例如匹配`?`就需要使用`\?`。

判断一个键是否存在：

```shell
exists <key>
```

可以删除一个或者多个键，返回值是删除的键的个数：

```shell
del <key ...>
```

获得键值的数据类型：

```shell
type <key>
```

# 数据类型

## String

字符串类型（*String*）是 Redis 中最基本的数据类型，可以存储任何形式的字符串，包括二进制数据，一个字符串类型键允许存储的数据的最大容量是 512 MB。

```shell
# 赋值
set <key> <value>
# 取值
get <key>
# 同时获取多个值
mget <key ...>
# 同时设置多个值
mset <key value ...>
# 向字符串尾部追加
append <key> <value>
# 获取字符串长度
strlen <key>
```

当存储的字符串是整数形式时，Redis 提供了一个实用命令`INCR`，其作用是让当前键值递增，并返回递增后的值：

```shell
# 递增
incr <key>
# 增加指定的整数
incrby <key> <increment>
# 递减
decr <key>
# 减少指定的整数
decrby <key> <increment>
# 增加指定浮点数
incrbyfloat <key> <increment>
```

位操作：

```shell
# 获取指定位置的二进制位值
getbit <key> <offset>
# 设置指定位置的二进制位值
setbit <key> <offset> <value>
# 统计二进制位值为1的个数
bitcount <key>
# 对多个字符串类型的键进行位运算，并将结果存储在指定的键当中
bitop and|or|xor|not <destkey> <key ...>
# 获取键指定位值的第一个位值的偏移量，start和end表示要查询的起始字节和结束字节
bitpos <key> 0|1 [start [end]]
```

## Hash



```shell
# 赋值，如果字段不存在则返回1，否则返回0
hset <key> <field> <value> [<field> <value> ...]
# 获取值
hget <key> <field>
# 获取多个值
hmget <key> <field> [<field> ...]
# 获取键中所有字段和值
hgetall <key>
# 判断字段是否存在，如果存在则返回1，否则返回0
hexists <key> <field>
# 当字段不存在时赋值，如果字段存在则不执行任何操作
hsetnx <key> <field>
# 增加数字
hincrby <key> <field> <increment>
# 删除字段
hdel <key> <field> [<field> ...]
# 只获取字段名
hkeys <key>
# 只获取值
hvals <key>
# 获取字段数量
hlen <key>
```



## List

## Set

## Sorted Set

## Stream

## Bitmap

## Bitfield

## Geospatial

# 持久化

Redis 将所有数据都存储在了内存中，在某些情况下，为了保证重启后 Redis 后数据不丢失，这时希望能将内存中的数据同步到硬盘中，使得重启后可以恢复数据，这一过程就是持久化。

## RDB

RDB 方式的持久化通过快照完成，

- 根据配置规则
- 执行`save`或者`bgsave`命令
