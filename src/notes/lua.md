---
title: Lua
---

# 安装

[LuaRocks](https://github.com/luarocks/luarocks) 是一个 Lua 模块的包管理器，安装 LuaRock 会自带一个 Lua 解释器，安装完成后使用 `lua -v` 来查看是否安装成功。

```shell
# macos
brew install luarocks
```

# LuaRocks

LuaRocks 将包含 Lua 代码模块的包称为 rock，可以使用 LuaRocks 来管理这些 rocks。安装后可以在 Lua 中使用 `require()` 来加载这些模块。rock 中包含了一个称为 rockspec 的声明文件，记录了 rock 的各种信息，例如元数据、依赖关系、构建规则等，打包后会变成一个以 `.rock` 后缀的压缩文件，在安装 rock 时，将会解压到本地的 rock 仓库中，称为 Rock Tree（类似于 npm 中的 node_modules 概念）。

## 配置

Luarocks 通常有三个级别的配置：项目级别、用户级别、系统级别。通常使用 `luarocks config` 配置默认会写入到系统级别。当使用 `luarocks init` 来创建项目时，默认写入到项目级别。

```shell
luarocks config <key> <value>
```

## 创建 rock

若要创建一个 rock，可以使用 LuaRocks 来初始化一个项目：

```shell
# 指定文件格式为 3.0 版本
luarocks init --rockspec-format 3.0
```

通常生成的 .rockspec 文件格式应该为这样：

```lua
rockspec_format = "3.0"
package = "lua-practice"
version = "dev-1"
source = {
   url = "*** please add URL for source tarball, zip or repository here ***"
}
description = {
   homepage = "*** please enter a project homepage ***",
   license = "*** please specify a license ***"
}
dependencies = {
}
build_dependencies = {
}
build = {
   type = "builtin",
   modules = {}
}
test_dependencies = {
}
```

## 安装包

通常 `luarocks install` 会将包安装到系统级别的 RockTree 中。当使用 `luarocks init` 初始化项目时，在其中执行安装则会安装到项目级别的 RockTree 中。

```shell
# 安装包
luarocks install <rock>
# 通过 .rockspec 文件来安装项目所需的依赖：
luarocks install --only-deps <rockspec>
# 卸载包
luarocks remove <rock>
# 列出包
luarocks list
```
