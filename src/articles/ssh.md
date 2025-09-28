---
title: SSH 配置
---

# 服务端配置

服务端需要安装 sshd：

```shell
apt install openssh-server
```

安装完成后需要修改 sshd 配置文件 `/etc/ssh/sshd_config`：

```
# 配置端口
Port 22
# 启用公钥认证
PubkeyAuthentication yes
```

修改完成后需要重新启动 sshd 服务：

```shell
systemctl restart sshd
```

# 客户端配置

1. 主机生成密钥

   ```shell
   ssh-keygen [-C <comment>] [-f <output_keyfile>]
   ```

2. 发送公钥到虚拟机

   `ssh-copy-id` 命令可以自动将公钥拷贝到远程服务器的 `~/.ssh/authorized_keys` 文件中，如果 `~/.ssh/authorized_keys` 文件不存在，`ssh-copy-id` 命令会自动创建该文件。

   ```shell
   ssh-copy-id [-i <pubkeyfile>] <username>@<host>
   ```

3. 登陆

   ```shell
   ssh [-i <prikeyfile>] <username>@<host>
   ```
