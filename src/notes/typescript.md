---
title: TypeScript
---

# 初始化项目

## 基本配置

1. 导入依赖

   ```shell
   npm install -D typescript
   # 可选，这是一个TypeScript运行时库，它包含了TypeScript编译器在生成代码时可能用到的一些辅助函数，能够有效减小编译后的包体积
   npm install -D tslib
   # 可选，Node.js声明文件
   npm install -D @types/node
   ```

2. 配置 `tsconfig.json`

   ```
   # 初始化一个tsconfig.json
   npx tsc --init
   ```

   指定根目录和输出目录：

   ```json{3-4}
   {
     "compilerOptions": {
       "rootDir": "./src",
       "outDir": "./dist",
     }
   }
   ```

   若要使用通用配置，可以安装 `@tsconfig/node-lts` 这个库，然后在 `tsconfig.json` 中继承这个配置：

   ::: group-code

   ```shell [npm install]
   npm install -D @tsconfig/node-lts
   ```

   ```json [tsconfig.json]
   {
     "extends": "@tsconfig/node-lts"
   }
   ```

   :::

   > [!NOTE]
   >
   > 如果需要其他适用于不同环境的通用配置，详细请看[这里](https://github.com/tsconfig/bases)。

3. `package.json` 配置

   ```json
   {
     "scripts": {
       "build": "tsc",
     }
   }
   ```

   `tsc` 会查找当前目录下的 `tsconfig.json` 文件作为配置来编译 `.ts` 文件。若不是以默认名称命名的配置文件，使用 `--project` 选项来指定配置文件。

## 实时编译运行

通常 `.ts` 需要编译之后才能运行，若要支持实时编译运行，可以使用 `tsx` 直接运行 `.ts` 文件。

```shell
npm install -D tsx
```

然后在 `package.json` 中配置：

```js{3}
{
  "scripts": {
    "dev": "tsx src/index.ts",
  }
}
```

# 常见配置选项

> [!NOTE]
>
> 有关更多 `tsconfig.json` 的配置请看[这里](https://www.typescriptlang.org/tsconfig/)。

## 顶层配置

- files

  指定包含的文件的允许列表。如果找不到任何文件，就会出现错误。

  ```json
  {
    "files": ["core.ts", "sys.ts", "types.ts"]
  }
  ```

- include, exclude

  指定要包含或者排除在程序中的文件名或模式数组。如果定义了 files 属性，则 include 默认值为 `[]`，否则是 `**/*`。

  ```json
  {
    "include": ["src/**/*", "tests/**/*"],
    "exinclude": []
  }
  ```

- extends

  这个属性会指定另一个 `tsconfig.json` 文件的路径并继承其中的配置，其中 references 属性不会被继承。

  ```json
  {
    "extends": "./configs/base"
  }
  ```
  
- references

  见[项目引用](#项目引用)。

## 编译选项

- typesRoot, types

  这个选项用来指定查找声明文件的根目录位置，默认情况下会在 `node_modules/@types` 中的查找。如果指定了 typeRoot，则只会在指定的路径之下进行查找（路径是相对于 `tsconfig.json` 的）。types 表示只查找指定的包。

  ```json
  {
    "compilerOptions": {
      "typeRoots": ["./typings", "./node_modules/@types"],
      "types": ["node", "jest", "express"] 
    }
  }
  ```

- rootDir, rootDirs

  rootDir 指定了项目的根目录，编译器会以此为基础计算输出文件的相对路径，默认值是所有输入文件（不包括声明文件）的最长公共目录，如果已设置 composite 属性，则默认值是包含 `tsconfig.json` 文件的目录。

  rootDirs 可以通知编译器，有许多”虚拟“目录充当单个根目录，这允许编译器在这些“虚拟”目录中解析相对模块导入，就好像它们被合并到一个目录中一样。

  ```json
  {
    "compilerOptions": {
      "rootDirs": ["src/views", "generated/templates/views"]
    }
  }
  ```

  ```
   src
   └── views
       └── view1.ts (can import "./template1", "./view2`)
       └── view2.ts (can import "./template1", "./view1`)
   generated
   └── templates
           └── views
               └── template1.ts (can import "./view1", "./view2")
  ```

- outDir

  指定编译输出路径。

  ```json
  {
    "compilerOptions": {
      "outDir": "dist"
    }
  }
  ```

- tsBuildInfoFile

  指定一个文件用来存储增量编译信息。通常默认值是 `<config-name>.tsbuildInfo`。

- declaration, declarationDir, declarationMap, isolatedDeclarations

  声明文件文件相关配置：

  ```json
  {
    "compilerOptions": {
      "declaration": true, // 自动生成声明文件
      "declarationMap": true, // 源码映射
      "declarationDir": "./types" // 声明文件路径
      "isolatedDeclarations": true // 强制要求每个声明文件可以独立编译，不依赖外部类型推断
    }
  }
  ```

- lib 和 target

  lib 指定要使用的 TypeScript 库中定义的声明文件集。target 指定生成 JS 使用的语法版本。改变 target 同时也会改变 lib 的默认值，通常为了方便可以只设置 target。

- baseUrl, path

  baseUrl 用于指定解析不是相对路径的模块名称的根路径，path 指定了一系列条目重新映射导入到相对于 baseUrl 的查找位置。

  ```json
  {
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
  ```
  
  > [!NOTE]
  >
  > 这两个属性通常要配合其他打包工具来使用，因为 TypeScript 不会编译映射的路径。
  
- module, moduleResolution

  module 用来设置程序的模块系统类型，常用的值：

  | module     | 含义                                                         |
  | ---------- | ------------------------------------------------------------ |
  | `nodenext` | 支持最新稳定版的 Node.js 的模块系统。                        |
  | `preserve` | 不转换模块语法，每个单个导入或导出语句的格式会被保留，而不是被强制采用单一格式来进行整个编译。 |
  | `esnext`   | 支持最新的 ES 模块语法。                                     |

  > [!NOTE]
  >
  > 这里的 `nodenext` 模拟的是 Node.js 下的 ESM，和 `esnext` 相比必须要在导入文件后加上扩展名。

  moduleResolution 表示使用哪种模块解析策略，通常指定了 module 会有对应的默认值。

- esModuleInterop

  这个选项用于解决 CommonJS 和 ESM 之间的互操作性问题，在编译时会添加辅助函数来解决模块系统兼容性问题。
  
- noImplicitAny, strictNullChecks

  对于新项目，应该启用这两个选项。noImplicitAny 表示必须显式的设置变量的类型。strictNullChecks 用于控制 `null` 和 `undefined` 在每种类型中是否被允许。

# 项目引用

现在有一个这样的项目：

```
my-project/
├── src/
│   └── math.ts
├── test/
│   └── math-tests.ts
└── tsconfig.json
```

其中文件如下：

::: code-group

```ts [tsconfig.json]
{
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

```ts [src/math.ts]
export function add(a:number, b: number):number {
    return a + b;
}
```

```ts [test/math-tests.ts]
import * as assert from 'assert';
import { add } from '../src/math'

assert.strictEqual(add(1, 1), 2);
```

:::

这个项目存在几个问题如下：

- src 目录也可以导入 test 目录中的文件，没有明确依赖关系。
- 在单配置文件下，无法控制输出结构。
- 如果要改变 `math.ts` 或者 `math-test.ts` 中的内容则需要再进行一次对未改变文件的重复的类型检查。
- 若使用多个配置文件来解决以上的构建问题，`tsc` 需要运行两次，同时 `tsc -w` 不能同时作用于多个配置文件。

通过项目引用，可以将一个项目分成多个部分，references 中的 path 属性可以指向包含 `tsconfig.json` 文件的目录，也可以指向配置文件。被引用的项目必须启用 composite 属性，同时要启用 declaration。

在 src 和 test 目录中创建新的配置文件，同时修改根目录下的配置文件如下：

::: code-group

```ts [tsconfig.json]
{
  "references": [
    {"path": "./src"},
    {"path": "./test"}
  ],
  "compilerOptions": {
    "outDir": "./dist",
    "composite": true,
    "declaration": true
  }
}
```

```ts [src/tsconfig.json]
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "outDir": "../dist/src",
  }
}
```

```ts [test/tsconfig.json]
{
  "extends": "../tsconfig.json",
  "references": [
    {"path": "../src"}
  ],
  "compilerOptions": {
    "outDir": "../dist/test",
  }
}
```

:::

然后使用 `--build` 选项运行 `tsc` 会自动查找 `tsconfig.json` 中的所有被引用的项目进行**增量编译**，这种编译模式下只编译更新过的源文件。

通过使用项目引用，从引用的项目中导入模块将直接加载其输出声明文件，而不是再是通过源码。通过分成多个项目，可以大大提高类型检查和编译的速度，减少使用编辑器时的内存使用，并改善程序逻辑分组的执行。
