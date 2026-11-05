---
title: 包管理器
type: JavaScript
---

<ContentHeader :references="references" />

<script setup>
const references = [
  {
    text: "npm doc",
    url: "https://docs.npmjs.com",
  },
  {
    text: "peer dependencies",
    url: "https://nodejs.org/en/blog/npm/peer-dependencies",
  },
  {
    text: "symlinked node modules structure",
    url: "https://pnpm.io/zh/symlinked-node-modules-structure",
  },
  {
    text: "how peers are resolved",
    url: "https://pnpm.io/how-peers-are-resolved",
  },
];
</script>

# 安装

使用 [corepack](https://github.com/nodejs/corepack) 来安装包管理器 npm、pnpm 或者 Yarn，这个 Node.js 脚本通常会随着 Node.js 一起发布。

```shell
# 启用corepack
corepack enable
# 安装包管理器
corepack install <-g,--global> [... name[@<version>]]
# 使用指定的包管理器
corepack use <name[@<version>]>
```

# npm

## 配置

npm 从命令行、环境变量和 .npmrc 文件中获取配置，通过`npm config`命令来编辑用户和全局 .npmrc 文件。配置文件中以 # 和 ; 开头的行会被解释为注释，可以在文件中使用环境变量。

```
# this is a comment
; this is a comment
key=value
# use variable
key=${HOME}
```

有4个级别的配置文件，优先级从高到低如下：

1. 项目配置文件：项目根目录下的 .npmrc 文件。
2. 用户配置文件：~/.npmrc 文件。
3. 全局配置文件：`{prefix}`/etc/npmrc。
4. 内置配置文件：不可改变，npm 内置的配置。

```shell
# 查看配置，-g 表示全局配置，-l 表示显示所有默认配置
npm config list [-g|-l]
# 指定配置写入到哪个级别，默认为用户级别
npm config set <key>=<value> [-L|--location <global|user|project>]
```

安装完成后通常需要写入的配置：

```shell
# 配置用户姓名邮箱
npm config set init-author-email="username@example.com"
npm config set init-author-name="username"
# 项目默认 license 类型
npm config set init-license="MIT"
# 配置 npm 镜像，国内阿里镜像源
npm config set registry=https://registry.npmmirror.com
```

## 作用域

当你注册 npm 用户帐户或创建组织时，你将被授予与你的用户或组织名称匹配的范围。可以将此范围用作相关包的命名空间。作用域允许你创建一个与其他用户或组织创建的包同名的包，而不会发生冲突。当在 package.json 文件中作为依赖项列出时，scoped 包前面会加上它们的作用域名称，作用域名称是 @ 和斜杠之间的所有内容，例如 @npm/package-name。默认情况下，scoped 包是私有的，发布时必须传递命令行标志以使它们公开。

## 创建包

可以使用`npm init`命令来创建包，会在目录下生成一个 [package.json](https://docs.npmjs.com/cli/v9/configuring-npm/package-json) 文件，其中列出了项目的元信息，包含所依赖的包，以便其他人轻松管理和安装。

```shell
# 创建 package.json 文件，-y 表示快速跳过，从当前目录提取信息
npm init [-y]
# 创建 scoped 包
npm init --scope=@<scope-name>
# 使用一个模版来创建
npm init <package-spec>
```

> [!IMPORTANT]
>
> 如果使用模版来创建一个包，通常这个模版包的名称必须是`create-`开头，然后会通过`npm exec create-<package-spec>`来执行其中的可执行文件。

## 语义版本

每次对自己的 npm 包进行重大更新时，建议在遵循语义版本规范的 package.json 文件中发布一个新版本的包，其中包含更新的版本号。遵循语义版本规范可以帮助依赖你代码的其他开发人员了解给定版本中的更改程度，并在必要时调整自己的代码。

| Code status                               | Stage         | Rule                                                               | Example version |
| ----------------------------------------- | ------------- | ------------------------------------------------------------------ | --------------- |
| First release                             | New product   | Start with 1.0.0                                                   | 1.0.0           |
| Backward compatible bug fixes             | Patch release | Increment the third digit                                          | 1.0.1           |
| Backward compatible new features          | Minor release | Increment the middle digit and reset last digit to zero            | 1.1.0           |
| Changes that break backward compatibility | Major release | Increment the first digit and reset middle and last digits to zero | 2.0.0           |

可以在包的 package.json 文件中指定包可以从依赖项接受哪些更新类型。例如，要指定可接受的版本范围，请使用以下语法：

- Patch release：1.0 或 1.0.x 或 ~1.0.4，表示主次版本号不变。
- Minor release：1 或 1.x 或 ^1.0.4，表示主版本号不变。
- Major release：`*` 或 `x`。

```json
"dependencies": {
  "my_dep": "^1.0.0",
  "another_dep": "~2.2.0"
}
```

> [!NOTE]
>
> 有关语义版本控制语法的更多信息，请参见 [npm semver calculator](https://semver.npmjs.com/)。

## 安装包

在使用 npm 安装包的时候，通常会将包安装到`{prefix}`目录之下，`{prefix}`默认为 Node.js 的安装目录，在大多数系统中，是 /usr/local，在 Windows 中，是 %APPDATA%\npm。npm 在默认情况下会从[中央仓库](http://npmjs.org)中搜索或下载包，包安装在`{prefix}`下的 node_modules 文件夹中。

```shell
# 查看安装路径，-g 选项表示全局模式下的路径
npm prefix [-g]
```

有两种安装模式决定了`{prefix}`的位置：

1. 本地模式

   使用本地模式安装时，`{prefix}`路径为当前目录，将包安装到当前目录的 node_modules 目录下，Node.js 的`require`在加载模块时会尝试搜寻 node_modules 子目录，因此使用 npm 本地模式安装的包可以直接被引用。可执行文件被链接到 node_modules/.bin 目录下。

2. 全局模式

   在全局模式下，Unix 系统中包安装到`{prefix}`/lib/node_modules 中，Windows 系统中的安装到 `{prefix}/node_modules`。可执行文件在 Unix 中链接到`{prefix}/bin`，在 Windows 中直接链接到`{prefix}`。使用全局模式安装的包并不能直接在代码中用`require`获得，因为`require`不会搜索全局安装路径。

|   模式   | 可通过require使用 | 注册PATH |
| :------: | ----------------- | -------- |
| 本地模式 | ✅                | 🚫       |
| 全局模式 | 🚫                | ✅       |

> [!NOTE]
>
> npm 与 Python 的包管理器 pip 行为不同，pip 总是以全局模式安装，使包可以供所有的程序使用，而 npm 默认会把包安装到当前目录下，这反映了 npm 不同的设计哲学。如果把包安装到全局，可以提高程序的重复利用程度，避免同样的内容的多份副本，但坏处是难以处理不同的版本依赖。如果把包安装到当前目录，则不会有不同程序依赖不同版本的包的冲突问题，同时还减轻了包作者的 API 兼容性压力，但缺陷则是同一个包可能会被安装许多次。

可以使用`npm install`命令来安装依赖：

```shell
# 安装所有在 package.json 中声明的依赖
npm install
# 安装指定的包，-g 表示以全局模式安装，scope 表示作用域，tag 默认为 latest
npm install [-g] [<@scope>/]<name>
npm install [<@scope>/]<name>@<tag>
npm install [<@scope>/]<name>@<version>
# 查看已安装的包，-g 表示查看全局模式下安装的包
npm list [-g]
# 卸载包
npm uninstall <name> [-g]
# 更新包
npm update <name>
```

通常 npm 会使用 package.json 文件中声明的依赖来安装依赖，如果项目中存在以下文件则会按以下顺序优先安装：

1. npm-shrinkwrap.json

   这个文件通过`npm shrinkwrap`命令创建，它与 package-lock.json 相同，不同的是它可以在发布包时包含在内。

2. package-lock.json

   对于 npm 修改 node_modules 树或 package.json 的任何操作，都会自动生成 package-lock.json，它描述了确切的依赖树，以便后续安装能够生成相同的树，而不管中间依赖项更新，因为有些传递性依赖会在两次安装之间发生了版本变化，中间依赖的更新可能带来行为上的差异。

3. yarn.lock

可以使用`npm ci`命令可以确保纯净的安装，使用`npm ci`和`npm install`的主要区别是：

- 项目中必须存在 package-lock.json 或者 npm-shrinkwrap.json 文件。
- 如果 package-lock.json 中的依赖项与 package.json 中的依赖项不匹配，`npm ci`将以错误退出，而不是更新 package-lock.json。
- 如果 node_modules 已经存在，它将在`npm ci`开始安装之前自动删除。
- `npm ci`不会修改 package.json 或 package-locks.json。

npm 会将指定的包保存到 package.json 文件中，同时可以通过附加标识控制依赖的类别，例如：

- -P, --save-prod

  安装到 dependencies 项中，这是默认选项。

- -D, --save-dev

  安装到 devDependencies 项中。表示用于本地环境开发的依赖包，这些包只在开发环境下使用，生产环境不会使用到这些包。

- -O, --save-optional

  安装到 optionalDependencies 项中。当希望某些依赖即使下载失败或者没有找到时，项目依然可以正常运行，就可以把这些依赖放在这里。

- --no-save

  不保存到 package.json 中，仅安装。

- -E, --save-exact

  保存的依赖项将使用精确的版本配置，而不是使用 npm 的默认 semver 范围操作符。

- -B, --save-bundle

  保存依赖到 bundleDependencies 项中，如果使用了修改的第三方库，或者非中央仓库中的依赖，他人无法获取，需要指定为 bundleDependencies，然后可以通过`npm pack`命令将项目打包成 .tgz 压缩包进行分发，同时包含这些依赖。

- --save-peer

  安装到 peerDependencies 项中。通常在开发插件包时，想要表达与主包的兼容性，这时需要将主包声明为**对等依赖**。对于对等依赖的要求，不需要指定精确版本，应该宽松。

  ```json
  {
    "name": "@npm/tea-latte",
    "version": "1.3.5",
    "peerDependencies": {
      "@npm/tea": "2.x"
    }
  }
  ```

  ```
  ├── @npm/tea-latte@1.3.5
  └── @npm/tea@2.2.0
  ```

  对于早期的 npm 版本，在安装插件包时对等依赖不会自动安装，当插件包的对等依赖和项目中已经声明的主包不兼容时，则只发出警告，然后继续安装。而在 npm v7 之后在安装插件包时会同时会安装对等依赖，当依赖树中出现冲突时会报错来阻止安装，你可能会看见以下提示：

  > <p>npm <font color="red">error</font> Fix the upstream dependency conflict, or retry</p>
  >
  > <p>npm <font color="red">error</font> this command with --force or --legacy-peer-deps</p>
  >
  > <p>npm <font color="red">error</font> to accept an incorrect (and potentially broken) dependency resolution.</p>

  --legacy-peer-deps 对应早期 npm 的行为，对等依赖不会被安装，npm 将会跳过对等依赖的检查，忽略冲突，继续尝试安装插件包。--force 表示覆盖冲突强制安装， npm 会强制安装插件包，并且可能会在依赖树中的不同层级放置这个对等依赖的不同版本，这可能导致项目里同时存在两个版本的相同依赖从而引发难以排查的运行时错误。

## 发布包

将一个包发布到中央仓库上：

```shell
# public 表示将 scoped 包公开发布，--tag 可以附带一个标签
npm publish [--access <restricted|public>] [--tag <tag>]
# 添加标签到指定版本
npm dist-tag add <package-name>@<version> [<tag>]
```

调整仓库中包的可见性：

```shell
# 将 public 包设置为 private
npm access restricted <package-name>
# 将 private 包设置为 public
npm access public <package-name>
```

## 运行脚本

package.json 文件的 scripts 属性支持许多内置脚本和预设生命周期事件以及任意脚本，通过`npm run <event>`运行，具有匹配名称的 pre 和 post 命令也将运行（例如：pre<u>test</u>，<u>test</u>，post<u>test</u>）。

```shell
# 如果没有提供命令，它将列出可用的脚本
# 若要给指定的脚本传递参数，使用 -- 来传递，参数只会传递给 npm 运行后指定的脚本，而不会传递给任何 pre 或 post 脚本
npm run <event> [-- <args>]
```

env 脚本是一个特殊的内置命令，可用于列出脚本在运行时可用的环境变量。如果在包中定义了 env 命令，它将优先于内置命令。

```shell
npm run env
```

> [!IMPORTANT]
>
> 除了 shell 预先存在的 PATH 之外，`npm run`会将 node_modules/.bin 目录添加到提供给脚本的 PATH 中。本地安装的依赖项提供的任何二进制文件都可以在没有 `node_modules/.bin` 前缀的情况下使用。

要为 package.json 的 scripts 部分中定义的任何脚本创建 pre 或 post 脚本，只需创建另一个具有匹配名称的脚本，并在它们的开头添加 pre 或 post，例如运行`npm run compress`将会依次运行以下脚本：

```json
{
  "scripts": {
    "precompress": "{{ executes BEFORE the `compress` script }}",
    "compress": "{{ run command to compress files }}",
    "postcompress": "{{ executes AFTER `compress` script }}"
  }
}
```

有一些特殊的[生命周期脚本](https://docs.npmjs.com/cli/v9/using-npm/scripts#life-cycle-scripts)只在某些情况下发生，这些脚本是在 pre`<event>`、post`<event>` 和 `<event>`脚本之外发生的，例如 prepare 脚本，会在执行`npm install`命令时运行，因此我们可以配合一些工具让它去执行一些自定义前置操作，例如[在 CI 环境下不生成 Git Hooks](https://typicode.github.io/husky/how-to.html#ci-server-and-docker)。

## 运行包

通常一个包可以有一个或者多个可执行命令，可以通过在 package.json 中的 bin 属性可以定义包中的可执行命令的集合：

```json
{
  "bin": {
    "myapp": "bin/cli.js"
  }
}
```

> [!WARNING]
>
> 这里的文件必须要以`#!/usr/bin/env node`开头，来表示查找 Node.js 环境来执行这个文件。

以全局模式安装这个包时，在 Unix 系统中这个文件会被链接到`{prefix}`/bin 目录下，在 Windows 系统中则是在`{prefix}`目录下创建一个 .cmd 文件来执行这个文件。以本地模式安装这个包时，这个文件会被链接到 node_modules/.bin 目录下。

若要执行包，需要使用通过`npm exec`或者`npx`来执行，这两个命令都可以执行以本地模式安装或者远程仓库的 npm 包中的可执行文件，优先本地。

```shell
# -- 之前的选项会被解析为 npm exec 的参数
# -- 之后的内容都会被原样传递给要执行的命令
npm exec [--package=<pkg>] <cmd> [-- [args...]]
# 属于 npx 自身的选项必须放在要执行命令之前，一旦 npx 确定了要执行的命令
# 它之后的所有内容都会被当作该命令的参数，而不会再去解析它们
npx [--package=<pkg>] <cmd> [args...]
```

## 链接

使用`npm link`能够避免重复且繁琐的打包发布操作，能够将包链接到其他项目中。`npm link`将在全局包安装目录中创建一个符号链接，链接到执行`npm link`命令的包，同时还将包中的任何可执行的二进制命令链接到`{prefix}`/bin/`{name}`中。请注意，`npm link`使用全局前缀（使用`npm prefix -g`查看）。如果要使用这个包，在其他项目中执行`npm link <package-name>`，将创建一个从全局安装的包到当前项目中 node_modules 目录的符号链接。

```shell
# 在全局目录中创建一个符号链接
npm link
# 将全局目录下的指定包链接到当前项目中
npm link [<@scope>/]<pkg>[@<version>]
```

## Workspaces

Workspaces 弥补了从本地文件系统处理链接包的工作流的不足，作为`npm install`的一部分，它自动化了链接过程，并消除了手动使用`npm link`的需要，以便添加对应该符号链接到当前 node_modules 文件夹中的包的引用。

如果项目需要开发一个子包，需要在主包中使用，可以使用`npm init -w <name>`命令来初始化一个新的 Workspaces，这将在指定的目录下创建一个子包，然后创建一个符号链接将子包链接到主包的 node_modules 目录中，并且在主包的 package.json 中定义 workspaces 属性来声明子包。

```shell
# 创建 Workspace
npm init -w <package-name>
可以为指定的 workspace 添加依赖：
npm install <package-name> -w <workspace-name>
# 在指定的 workspace 中运行脚本
npm run <script> -w <workspace-name>
# 在所有的 workspace 中运行脚本，--if-present 表示会忽略不存在的脚本
npm run <script> -ws --if-present
```

假设当前项目 package.json 和项目结构如下：

```json
{
  "name": "my-workspaces-powered-project",
  "workspaces": ["packages/a"]
}
```

```
├─ package.json
└─ packages
   └─ a
      └─ package.json
```

在使用`npm install`来安装项目依赖之后，会生成一个符号链接到主包的 node_modules 目录中，从而省略了手动`npm link`的步骤：

```
├─ node_modules
|  └─  bar -> ../packages/a
├─ package-lock.json
├─ package.json
└─ packages
   └─ a
      └─ package.json
```

# pnpm

## 优势

1. 节省磁盘空间

   使用 npm 时，依赖每次被不同的项目安装，都会被重复安装一次，而在使用 pnpm 时，依赖会被存储在[内容可寻址的存储](https://pnpm.io/settings/store#storedir)中。默认情况下，pnpm 会为每个项目创建一个 .pnpm 目录保存在 node_modules 目录下，这被称为**虚拟目录**，其中包含了指向内容可寻址的存储的硬连接，这样可以让不同项目共享同一版本的依赖而不是复制文件。同时，当依赖有版本更新时，只会做增量更新，而不是下载整个依赖到内容可寻址的存储中。

   ```
   project-a/
   └── node_modules/
       ├── lodash → .pnpm/lodash@4.17.21/node_modules/lodash
       └── .pnpm/
           └── lodash@4.17.21/
               └── node_modules/
                   └── lodash/            ← hardlinks to content-addressable store
   project-b/
   └── node_modules/
       ├── lodash → .pnpm/lodash@4.17.21/node_modules/lodash
       └── .pnpm/
           └── lodash@4.17.21/
               └── node_modules/
                   └── lodash/            ← same hardlinks, duplicated directory structure
   ```

2. 安装速度快

   pnpm 在下载依赖时会执行三个阶段依赖解析、目录结构计算以及链接依赖。每个依赖在某一阶段准备就绪，就会进入下一个阶段，而无需等待其他依赖的完成，这比传统的三阶段安装过程更快。

3. 非扁平的 node_modules

   使用 npm 来安装依赖项时，所有依赖都会被提升到 node*modules 的根目录，因此在源代码中可以访问未作为依赖项添加到项目的依赖项（也就是 \_Phantom Dependency* 问题），而 pnpm 仅将声明过的依赖使用符号链接添加到 node_modules 的根目录中，从而避免这个问题。

   ```
   node_modules
   ├── foo -> ./.pnpm/foo@1.0.0/node_modules/foo
   └── .pnpm
       ├── bar@1.0.0
       │   └── node_modules
       │       ├── bar/  (files linked from <store>)
       │       └── qar -> ../../qar@2.0.0/node_modules/qar
       ├── foo@1.0.0
       │   └── node_modules
       │       ├── foo/  (files linked from <store>)
       │       ├── bar -> ../../bar@1.0.0/node_modules/bar
       │       └── qar -> ../../qar@2.0.0/node_modules/qar
       └── qar@2.0.0
           └── node_modules
               └── qar/  (files linked from <store>)
   ```

   > 注：这里例子中，bar 是 foo 的直接依赖，qar 是 bar 和 foo 的直接依赖。

   Node.js 在解析模块路径时会忽略符号链接，去找到文件真实的位置，如果在项目中使用了`require('foo')`，实际会找到真正的硬链接文件来加载（即 .pnpm/foo@1.0.0/node_modules/foo）。而当 foo 中的代码使用了`require('bar')`时，Node.js 会遵循向上查找 node_modules 这个规则，因此这也是为什么会有两层 node_modules 以及依赖处于同一层级而不是子目录下的原因。

## pnpm workspace

pnpm 内置了对 monorepo 的支持，可以创建一个 Workspace 来将多个项目合并到一个项目中，一个 Workspace 必须在它的根目录有一个 pnpm-workspace.yaml 文件，用于定义 Workspace 的根目录，这个文件也能够从 Workspace 中包含或者排除目录。

```yaml
packages:
  # 指定根目录直接子目录中的包
  - "my-app"
  # packages/ 直接子目录中的所有包
  - "packages/*"
  # components/ 子目录中的所有嵌套的包
  - "components/**"
  # 排除测试目录中的包
  - "!**/test/**"
```

pnpm 支持`workspace:`协议，当使用此协议时，pnpm 将拒绝解析除 Workspace 所包含包之外的任何内容。如果使用`workspace:`协议，pnpm 将仅链接来自 Workspace 的包。

```json
"dependencies": {
    "cowsay": "^1.5.0",
    "world": "workspace:^"
}
```

有关 Workspace 的基本命令如下：

```shell
# 仅在workspace中安装
pnpm add -w <package>
# 在子包中安装
pnpm --filter <package_selector> add <package>
```

## 对等依赖冲突

在 pnpm 中每个依赖都会有一组确定的依赖集，但是如果一个依赖存在对等依赖，那么可能会存在多个依赖集。pnpm 会为不同的对等依赖项创建不同的解析。请看这个例子：

```
- foo-parent-1
  - bar@1.0.0
  - baz@1.0.0
  - foo@1.0.0
- foo-parent-2
  - bar@1.0.0
  - baz@1.1.0
  - foo@1.0.0
```

```
node_modules
└── .pnpm
    ├── foo@1.0.0_bar@1.0.0+baz@1.0.0
    │   └── node_modules
    │       ├── foo
    │       ├── bar   -> ../../bar@1.0.0/node_modules/bar
    │       └── baz   -> ../../baz@1.0.0/node_modules/baz
    ├── foo@1.0.0_bar@1.0.0+baz@1.1.0
    │   └── node_modules
    │       ├── foo
    │       ├── bar   -> ../../bar@1.0.0/node_modules/bar
    │       └── baz   -> ../../baz@1.1.0/node_modules/baz
    ├── bar@1.0.0
    ├── baz@1.0.0
    ├── baz@1.1.0
```

> 这个例子中，foo 的对等依赖是 bar 和 baz，而 baz 在宿主包中有不同的版本。

foo@1.0.0 具有两个不同版本的对等依赖 baz@1.0.0 和 baz@1.1.0，因此需要为不同的对等依赖项创建不同的解析（即 foo@1.0.0_bar@1.0.0+baz@1.0.0 和 foo@1.0.0_bar@1.0.0+baz@1.1.0）。

对于某些插件包，源码中不直接`require`对等依赖，而是以参数这种形式将对等依赖中的某个对象传递进来，插件访问其中指定的属性，那么在宿主环境中，直接依赖了这个新版本的对等依赖，但是其中 api 的变化导致删除了某些属性，那么传递进去给插件再访问是有报错的可能，那么 pnpm 这种安装模式是否起到了反效果？

如果 pnpm 没有为插件创建独立的对等依赖解析，而是让插件直接共享宿主环境的最新版依赖，那么插件在访问被删除属性时同样会出错，而且你连“插件声明了旧版本对等依赖”这个警告信号都看不到。这种隔离机制反而是一种保护，pnpm 创建独立解析的意义在于它让插件在依赖解析层面拿到它声明兼容的版本，但当手动把新版对象作为参数传进去时，你就绕过了 pnpm 建立的隔离，插件代码运行在它自己的模块作用域里，但它处理的数据来自宿主的模块作用域。版本不兼容的后果，由你的代码逻辑承担。

要避免这种问题可以启用 strict-peer-dependencies 这个属性，可以让 pnpm 在安装时就对版本不匹配报错，这反而能提前暴露问题。最根本的解决问题还是**升级插件让它声明的范围覆盖你使用的新版本**。

> [!TIP]
>
> 有关更多 pnpm 对于对等依赖的行为控制请看[这里](https://pnpm.io/settings/peer-dependencies)。
