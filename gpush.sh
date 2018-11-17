git pull origin master
npm install
git  add .
git commit  -m  "$*"
git remote add origin https://github.com/BigBroSci-LVTHW/LVTHW.git
git remote -v
git push origin  master

hexo generate && hexo deploy
