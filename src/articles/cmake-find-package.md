---
title: CMake 查找外部依赖
---

# 如何查找已安装的软件包

CMake 提供了许多方法来将外部依赖合并到构建中，项目和用户可以灵活地选择最适合他们需求的方法。其中最主要的方法就是使用 `find_package()` 和 FetchContent 模块，FindPkgConfig 模块有时也会使用，但是这种方式缺少其他两种方式的一些集成。

> 参考文章：https://cmake.org/cmake/help/latest/guide/using-dependencies/index.html

# `find_package()`

一个被项目需要的包可能已经构建过并且在用户的操作系统的某个位置中可用，这个包可能被 CMake 构建过，或者被其他的构建系统使用过，甚至是一些没有被构建的文件集合。CMake 提供了 `find_package()` 命令来应对这些场景，这个命令可以搜索已知的位置，以及项目或用户提供的其他提示和路径来查找这个包。`find_package()` 支持两种模式来搜索模块。CMake 内置了许多查找模块，可以查找第三方库，例如 OpenGL、OpenSSL 等，支持的第三方库列表可以在[这里](https://cmake.org/cmake/help/latest/manual/cmake-modules.7.html#find-modules)找到。

## 配置模式

在这个模式下，查找由包本身提供的配置文件，其中定义了 CMake 目标、变量和命令。通常 `<PackageName>` 是 `find_package()` 命令的第一个参数，甚至可能是唯一的参数，也可以使用 `NAMES` 选项指定替代名称：

```
find_package(SomeThing
  NAMES
    SameThingOtherName   # Another name for the package
    SomeThing            # Also still look for its canonical name
)
```

> [!TIP]
>
> 配置文件的名称必须是 `<PackageName>Config.cmake` 或者 `<LowercasePackageName>-config.cmake`，在同一个目录下也可能会存在名为 `<PackageName>ConfigVersion.cmake` 或者 `<LowercasePackageName>-config-version.cmake` 的可选文件。CMake 使用此文件来确定包的版本是否满足 `find_package()` 调用中包含的任何版本约束。

包的搜索路径是 CMake 基于平台已知的（详情查看[配置模式搜索过程](https://cmake.org/cmake/help/latest/command/find_package.html#search-procedure)），如果包的路径不是 CMake 已知的，那么需要使用 `CMAKE_PREFIX_PATH` 变量，它被视为要在其中搜索配置文件的基本路径的列表。例如，安装在 `/opt/somepackage` 中的软件包通常会安装配置文件`/opt/somepackage/lib/cmake/somePackage/SomePackageConfig.cmake`，在这种情况下，应该将 `/opt/somepackage` 添加到 `CMAKE_PREFIX_PATH` 中。

> [!TIP]
>
> `CMAKE_PREFIX_PATH` 变量也是一个列表，但它需要使用特定于平台的环境变量列表项分隔符（Unix 上为 `:`，Windows 上为 `;`）。

## 模块模式

并不是所有的包都支持 CMake，许多依赖没有提供支持配置模式所需的文件，在这种模式下，可以提供一个 `Find<SomePackage>.cmake` 文件，CMake 将搜索由 `CMAKE_MODULE_PATH` 变量指定的路径来定位查找这个文件，查找模块文件通常不由包本身提供。

```
list(APPEND CMAKE_MODULE_PATH "${CMAKE_CURRENT_SOURCE_DIR}/cmake/module")
```

调用 `find_package()` 命令会加载 `Find<SomePackage>.cmake` 文件，这个查找模块主要的功能是确定包是否存在，设置 `<PackageName>_FOUND` 变量，并且提供使用包所需要的变量、宏、导入目标。

模块查找文件通常是以许可证通知开头，然后是空行，然后是括号注释。注释应以 `.rst:` 开头，以表明其其余内容是 reStructuredText 格式文档。例如：

```cmake
# Distributed under the OSI-approved BSD 3-Clause License.  See accompanying
# file LICENSE.rst or https://cmake.org/licensing for details.

#[=======================================================================[.rst:
FindFoo
-------

Finds the Foo library.

Imported Targets
^^^^^^^^^^^^^^^^

This module provides the following imported targets, if found:

``Foo::Foo``
  The Foo library

Result Variables
^^^^^^^^^^^^^^^^

This will define the following variables:

``Foo_FOUND``
  True if the system has the Foo library.
``Foo_VERSION``
  The version of the Foo library which was found.
``Foo_INCLUDE_DIRS``
  Include directories needed to use Foo.
``Foo_LIBRARIES``
  Libraries needed to link to Foo.

Cache Variables
^^^^^^^^^^^^^^^

The following cache variables may also be set:

``Foo_INCLUDE_DIR``
  The directory containing ``foo.h``.
``Foo_LIBRARY``
  The path to the Foo library.

#]=======================================================================]
```

模块文档通常由以下几个部分组成：

- 指定模块名称的下划线标题。
- 对模块内容的简单描述。
- 列出模块提供的导入目标的部分（如果有的话）。
- 列出模块提供的结果变量的部分。
- 可选列出模块使用的缓存变量的部分（如果有的话）。

然后可以使用 `find_path()` 和 `find_library()` 来查找头文件和库文件的位置。这个命令用于查找库，将创建一个名为 `VAR` 的缓存条目（如果没有指定了 `NO_CACHE` 则为普通变量）来存储此命令的结果，如果没有找到变量则结果为 `VAR-NOTFOUND`。`NAMES` 指定要查找的库的名称。`HINTS` 和 `PATHS` 表示除了默认位置外，还指定要搜索的目录。`PATH_SUFFIXES` 指定在每个目录位置下额外的子目录以进行检查。如果指定了 `NO_DEFAULT_PATH`，则不会向搜索中添加其他路径。

```
find_path(
  <VAR>
  NAMES name1 [name2 ...] [NAMES_PER_DIR]
  [HINTS [path | ENV var]...]
  [PATHS [path | ENV var]...]
  [PATH_SUFFIXES suffix1 [suffix2 ...]]
  [NO_CACHE]
  [NO_DEFAULT_PATH]
)

find_library (
  <VAR>
  NAMES name1 [name2 ...] [NAMES_PER_DIR]
  [HINTS [path | ENV var]...]
  [PATHS [path | ENV var]...]
  [PATH_SUFFIXES suffix1 [suffix2 ...]]
  [NO_CACHE]
  [NO_DEFAULT_PATH]
)
```

现在，可以使用 `FindPackageHandleStandardArgs` 模块来处理大部分剩余步骤，`find_package_handle_standard_args` 命令可以处理 `find_package()` 的 REQUIRED、QUIET 和版本相关参数。它还设置了 `<PackageName>_FOUND` 变量。如果列出的所有变量都包含有效的结果，例如有效的文件路径，则该软件包被视为已找到。

```cmake
include(FindPackageHandleStandardArgs)
find_package_handle_standard_args(<PackageName>
  [REQUIRED_VARS <required-var>...]
  [VERSION_VAR <version-var>]
)
```

当需要提供**导入目标**时，这些目标应该是包含在命名空间中，CMake 将识别传递给 `target_link_libraries()` 的值，其名称中包含 `::` 的值应该是导入目标。

```cmake
if(PackageName_FOUND)
  set(PackageName_LIBRARIES ${PackageName_LIBRARY})
  set(PackageName_INCLUDE_DIRS ${PackageName_INCLUDE_DIR})
endif()

if(PackageName_FOUND AND NOT TARGET PackageName::TargetName)
  add_library(PackageName::TargetName UNKNOWN IMPORTED)
  set_target_properties(PackageName::TargetName PROPERTIES
    IMPORTED_LOCATION "${PackageName_LIBRARY}"
    INTERFACE_INCLUDE_DIRECTORIES "${PackageName_INCLUDE_DIR}"
  )
endif()
```

# 使用 FetchContent 模块

依赖不一定要预先构建才能在 CMake 中使用，也可以从源码构建作为主项目的一部分。FetchContent 模块提供了下载内容的功能，如果依赖项也使用 CMake，则可以将其添加到主项目。对 `find_package()` 的调用可以在内部重定向到 FetchContent 模块提供的包。使用 FetchContent 模块包括三个部分：

1. 用 `include(FetchContent)` 将模块包裹到项目中。
2. 使用 `FetchContent_Declare()` 指令配置依赖性。
3. 使用 `FetchContent_MakeAvailable()` 指令填充依赖性。这个命令会下载、构建、安装依赖到构建目录下的`_deps` 目录中。

```cmake
include(FetchContent)
FetchContent_Declare(
  googletest
  GIT_REPOSITORY https://github.com/google/googletest.git
  GIT_TAG        703bd9caab50b139428cea1aaff9974ebee5742e # release-1.10.0
)
FetchContent_MakeAvailable(googletest)
```



