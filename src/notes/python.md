---
title: Python
---

# 安装

可以安装 [pyenv](https://github.com/pyenv/pyenv) 来管理 Python 的版本，或者使用 [conda](#conda)。

# conda

conda 是一款功能强大的命令行工具，可用于在 Windows、MacOS 和 Linux 上运行的软件包和环境管理。常用命令如下：

```shell
# 查看conda版本
conda --version
# 更新conda版本
conda update conda
```

## 管理环境

- 创建环境

  可以使用 conda 来创建拥有不同版本 python 和软件包的环境，在环境之间切换或移动称为**激活环境**。

  ```shell
  # 指定环境名称，同时可以安装多个包
  conda create -n <my-env> [package_spec ...]
  # 创建环境时可以指定环境的安装路径
  conda create --prefix <path> [package_spec ...]
  # 可以使用 yml 文件来创建环境
  conda env create -f environment.yml
  ```

  创建的环境默认会安装到 `/envs` 目录下，此环境中不会安装任何软件包，如果希望安装环境的时候默认安装某些包，可以添加 `create_default_packages` 配置在 `.condarc` 文件中，这样每次创建新环境时都会安装默认包：

  ```
  create_default_packages:
    - pip
    - ipython
    - scipy=0.15.0
  ```

  > [!TIP]
  >
  > 如果不希望在特定环境中安装默认包，可以使用 `--no-default-packages` 选项。

  默认情况下，conda 将创建针对当前运行平台的环境，如果想要创建针对指定平台的环境，可以使用 `--platform` 选项，例如：

  ```shell
  conda create --platform osx-64 --name python-x64 python
  ```

- 查看环境信息

  ```shell
  # 查看当前配置信息
  conda info
  # 查看环境列表
  conda env list
  ```
  
- 激活环境

  ```shell
  # 激活
  conda activate <my-env>
  # 取消激活
  conda deactivate
  ```

- 更新环境

  当需要更新 `environment.yml` 文件的内容时：

  ```shell
  # --prune选项表示从环境中删除任何不再需要的依赖项
  conda env update --file environment.yml --prune
  ```

- 克隆环境

  ```shell
  conda create --name <myclone> --clone <myenv>
  ```

- 导出环境

  ```shell
  # 导出环境中所有的包
  conda env export > environment.yml
  ```

  当环境中安装显示安装某些包时，这将下载并安装许多其他包来解决依赖关系，这将引入跨平台可能不兼容的包。如果使用 `conda env export`，这将导出所有的包，如果使用 `--from-history` 选项，将只会导出显示声明的包。

- 重置环境

  conda 保留了对环境所做的所有更改的历史记录，因此可以回滚到之前的版本。

  ```shell
  # 列出现在环境所有的历史版本
  conda list --revisions
  # 恢复到之前的指定的版本
  conda install --revision=<REVNUM>
  ```

- 删除环境

  ```shell
  conda remove --name <my-env> --all
  ```

## 管理 Channels

conda 从远程 channels 下载包，这些 channels 是指向包含 conda 包的目录的 URL，conda 从默认 channels 自动下载和更新包。不同的 channels 可以有相同的包，所以 conda 必须处理这些 channels 冲突。默认情况下，conda 优先选择来自高优先级 channels 的包，而不是来自低优先级 channels 的任何版本。

```shell
conda config --add channels new_channel
```

## 管理包

```shell
# 如果没有指定环境名称则会安装到当前的环境中
conda install --name <my-env> <package_spec[=<version>]>
# 显示当前包列表
conda list
# 删除指定包
conda remove <package_spec>
# 更新包
conda update <package_spec>
```

## 配置文件

conda 配置文件 `.condarc` 是一个可选的运行时配置文件，它允许高级用户配置 conda 的各个方面，例如它在哪些 channel 中搜索包、代理设置和环境目录。conda 会在指定的位置搜索配置文件，通常是 conda 安装目录、用户目录和当前已经激活的环境目录。默认情况下不包含 `.condarc` 文件，但在首次运行 `conda config` 命令时，会在主目录中自动创建该文件。使用 `conda config` 如果没有指定配置文件路径，默认会使用用户配置。

- `--system`：表示系统配置文件。
- `--env`：表示已经激活的环境配置文件中，如果没有激活将写入用户配置文件中。

```shell
# 获取所有键及其值
conda config --get
# 要显示所有配置文件源及其内容
conda config --show-sources
# 添加配置
conda config --add <key> <value>
# 删除配置
conda config --remove <key> <value>
```

# pip

pip 是 Python 的包管理程序，可以使用 pip 从 PyPI（*The Python Package Index*）或者其他的仓库安装包，调用 pip 可以直接在命令行输入 pip，或者使用 `python -m pip` 来调用。常用命令如下：

```shell
# 常用pip命令
pip install <package>				# 安装包
pip install <package> --user		# 安装包到用户站点
pip install <package> --upgrade		# 删除之前的包并更新包
pip uninstall <package>				# 卸载包
pip show <package>					# 显示包的信息
pip list							# 列出已经安装的包
pip config list -v					# 查看详细的配置文件（显示配置文件位置）
```

pip 允许在一个配置文件中为命令行选项设置默认值，配置文件的名称和位置因平台而异，pip 拥有三个级别的配置文件。如果存在多个配置文件，将会以 Global、User、Site 的顺序组合起来，每个配置文件读取的值将覆盖之前配置文件读取的值，例如全局配置文件和用户配置文件都指定了相同的值，将使用用户配置文件的值。

- Global：跨用户共享的系统范围配置文件。
- User：用户配置文件。
- Site：虚拟环境配置文件。

> [!TIP]
>
> 环境变量 `PIP_CONFIG_FILE` 可用于指定最后加载的配置文件，其值将覆盖上述文件中设置的值。有关配置文件的更多说明请查看[参考手册](https://pip.pypa.io/en/stable/topics/configuration/)。

配置文件中设置的名称来自于命令行选项，每个子命令都可以在自己的部分选择配置，以便覆盖具有相同名称的全局设置，具体命令请查看命令行帮助，例如输入 `pip freeze -h` 查看 `freeze` 子命令的选项。

```ini
[global]
timeout = 60
[freeze]
timeout = 10
```

Python 使用的[安装方案](https://docs.python.org/3/library/sysconfig.html#installation-paths)因平台和安装选项而异，这些方案根据 `os.name` 返回的值存储在 `sysconfig` 中的唯一标识符下，包安装程序使用这些方案来确定将文件复制到何处。

```shell
# 查看配置信息
python -m sysconfig
```

> [!TIP]
>
> 用户方案对所有的 Python 发行版都支持特定于用户的替代安装位置，可以使用 `pip install --user` 来开启，可以使用环境变量 `PYTHONUSERBASE` 来自定义安装位置，这个值会改变 `site.USER_BASE` 的值。


# 虚拟环境

Python 应用程序通常会使用不属于标准库的一部分包和模块，应用程序有时需要库的特定版本，因为应用程序可能需要修复特定 Bug，或者可能使用库接口的过时版本编写应用程序。因此一个 Python 可能无法满足所有应用的需求，例如如果应用 A 需要特定模块的1.0版本，而应用 B 则需要2.0版本，则会发生冲突，安装任何一个版本都将会导致一个应用无法使用。解决方案则是创建一个**虚拟环境**，其中包含了 Python 特定版本和一些附加的包，可以为不同的应用程序创建不同的虚拟环境，从而解决版本冲突的问题。

创建和管理虚拟环境的模块叫做 `venv`，在命令行输入以下命令将会创建一个虚拟环境，虚拟环境的通用名称为 `.venv`。

```shell
# 会在指定的<dir>目录下创建虚拟环境，父级目录不存在则会创建
python -m venv <dir>
# 通常在工程目录下这样写
python -m venv .venv
```

在创建虚拟环境后，可以使用虚拟环境目录中的脚本去激活，激活是将虚拟环境的目录添加到 Python 的路径中，然后 Python 就可以调用虚拟环境中的解释器运行脚本。

```shell
workspace\Script\activate.bat	#在windows中
source workspace/bin/activate	#在Unix或MacOS中
```

> [!TIP]
>
> 在命令行中输入 `deactivate` 可以停止使用虚拟环境。

虚拟环境结构如下：

```
|-- .venv
      |-- include
      |-- lib
      |-- Scripts
      |-- pyvenv.cfg
```

> [!TIP]
>
> pyvenv.cfg 文件中 include-system-site-packages 设置为 true 则会使用系统站点包运行。

# 运行 Python

- 交互模式

  安装 Python 后在命令行输入 `python`，启动交互式解释器，可以使用解释器来运行 Python 代码，也就是**交互模式**（*interactive mode*），常用命令如下：

  ```shell
  python -V				# 输出版本号
  python -h				# 帮助
  python -m <module_name>	# 作为脚本运行库模块
  python -m site			# 查看包搜索路径和用户站点路径
  ```

- 脚本模式

  当要编写很多代码时，使用交互解释器就不方便了，这时可以使用**脚本模式**（*script mode*）运行解释器并执行 Python 代码，Python 脚本以 `.py` 为后缀，在命令行输入 `python filename` 即可运行 Python 脚本。

  ```shell
  python main.py
  ```

# 注释

Python 中的单行注释以 `#` 开头，多行注释可以用 `'''` 和 `"""`。

```python
# 这是单行注释，从井号开始到行尾的所有内容都会被解释器忽略

"""
文档字符串，通常写在函数开始位置，用来解释函数接口
"""
```
