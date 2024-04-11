pid=$(lsof -ti:50004)
echo $pid
pm2 list
if [ -n "$pid" ]; then
pm2 restart emma
else
# npm start
pm2 start "npm run dev -- -H 192.168.10.7 -- -p 50004" --name emma
fi