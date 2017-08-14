@echo off

attrib +h .code_root

where /q node || (echo 错误：没有安装Node.js && pause && exit)

where /q webpack || call npm install -g webpack

where /q webpack-dev-server || call npm install -g webpack-dev-server

call npm install || (call npm install windows-build-tools & call npm install)


pause
