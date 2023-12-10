#!/bin/bash

# 设置本地和远程目录路径
local_path="/Users/alex/codebase/nanx/cloud-crm-front/build/"
remote_path="/data/nanx/cloud-crm-front/build/"

# 设置服务器信息
server_address="119.254.88.173"
server_username="root"


#!/bin/bash

# 设置本地和远程目录路径

# 设置服务器信息
private_key_path="/Users/alex/.ssh/mac_id_rsa"

# 使用 rsync 清除远程目录并同步本地目录到服务器
rsync -avz --delete -e "ssh -i $private_key_path" "$local_path" "$server_username@$server_address:$remote_path"
