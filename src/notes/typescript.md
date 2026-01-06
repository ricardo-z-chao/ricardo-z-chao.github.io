---
title: TypeScript
---

# 初始化项目

## 安装依赖

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
   # 添加通用配置
   npm install -D @tsconfig/node-lts
   ```

   然后在 `tsconfig.json` 中添加：

   ```json
   {
     "extends": "@tsconfig/bases/node-lts"
   }
   ```
   
   > [!NOTE]
   >
   > 如果需要其他适用于不同环境的通用配置，详细请看[这里](https://github.com/tsconfig/bases)。
   
3. `package.json` 配置

   ```json
   {
     "main": "lib/index", // 定义包入口点，运行时加载lib/index.js
     "types": "lib/index" // 类型声明文件，加载lib/index.ts
   }
   ```

## 实时编译运行

通常 `.ts` 需要编译之后才能运行，若要支持实时编译运行，可以使用 `ts-node` 直接运行 `.ts` 文件，无需预编译。

```shell
npm install -D ts-node
```

ts-node 会自动查找 `tsconfig.json` 文件，并且识别其中的 `ts-node` 字段：

```json
"ts-node": {
  // It is faster to skip typechecking.
  // Remove if you want ts-node to do typechecking.
  "transpileOnly": true,
  "files": true,
  "compilerOptions": {
    // compilerOptions specified here will override those declared below,
    // but only in ts-node. Useful if you want ts-node and tsc to use
    // different options with a single tsconfig.json.
  }
}
```

> [!TIP]
>
>  `ts-node --showConfig` 会显示出已经使用的配置，`ts-node -vv` 会显示 Node.js 和 TypeScript 的版本。

# 常见配置选项

> [!NOTE]
>
> 更多 `tsconfig.json` 的配置请看[这里](https://www.typescriptlang.org/tsconfig/)。

- files

  指定包含的文件的允许列表。如果找不到任何文件，就会出现错误。

  ```json
  {
    "files": ["core.ts", "sys.ts", "types.ts"]
  }
  ```

- include, exclude

  指定要包含或者排除在程序中的文件名或模式数组。

  ```json
  {
    "include": ["src/**/*", "tests/**/*"],
    "exinclude": []
  }
  ```

- extends

  这个属性会指定另一个 `tsconfig.json` 文件的路径并继承其中的配置。

  ```json
  {
    "extends": "./configs/base"
  }
  ```

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

  rootDir 指定了项目的根目录，编译器会以此为基础计算输出文件的相对路径。rootDirs 可以通知编译器，有许多”虚拟“目录充当单个根目录，这允许编译器在这些“虚拟”目录中解析相对模块导入，就好像它们被合并到一个目录中一样。

  ```json
  {
    "compilerOptions": {
      "rootDirs": ["src/views", "generated/templates/views"]
    }
  }
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
      "@hooks/*": ["src/hooks/*"],
      "@utils/*": ["src/utils/*"],
      "@services/*": ["src/services/*"],
      "@store/*": ["src/store/*"],
      "@types/*": ["src/types/*"],
      "@assets/*": ["src/assets/*"],
      "@styles/*": ["src/styles/*"],
      "@pages/*": ["src/pages/*"]
    }
  }
  ```

  > [!NOTE]
  >
  > 这两个属性通常要配合其他打包工具来使用，因为 TypeScript 不会编译映射的路径。

- module, moduleResolution

  moduel 表示生成哪种模块代码，moduleResolution 表示使用哪种模块解析策略。

# 使用 Babel 代替编译

可以将 babel 用于编译，而 tsc 只用于类型检查。
