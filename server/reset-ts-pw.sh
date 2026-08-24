#!/bin/bash
# Reset TS3 serveradmin query password (runs on xxl VPS)
# TS3 stores sha256(password). Stop container, edit DB, start, verify login.
set -e
PW=$(openssl rand -hex 12)
HASH=$(python3 -c "import hashlib; print(hashlib.sha256('$PW'.encode()).hexdigest())")
DB=/home/ninja/docker/ts3server/ts3server.sqlitedb

echo ">> stopping ts3-server"
docker stop ts3-server >/dev/null

echo ">> updating password hash"
sqlite3 "$DB" "UPDATE clients SET client_login_password='$HASH' WHERE client_id=1;"

echo ">> starting ts3-server"
docker start ts3-server >/dev/null
sleep 5

echo ">> verifying query login"
python3 - << PYEOF
import socket, sys, time
pw = "$PW"
s = socket.create_connection(("127.0.0.1", 10011), timeout=8)
time.sleep(1); s.recv(4096)
def cmd(c):
    s.send((c + "\n").encode())
    time.sleep(0.6)
    return s.recv(65536).decode()
r1 = cmd("login serveradmin " + pw)
print("LOGIN:", r1.strip().splitlines()[-1])
cmd("use port=9987")
r3 = cmd("clientlist")
ok = "error id=0" in r3
print("CLIENTLIST:", r3.split("error id=")[-1].split("\n")[0][:20])
if ok:
    open("/home/ninja/cs16-config/.ts_pw", "w").write(pw)
    print("PW_SAVED")
PYEOF
echo "NEW_PW=$PW"
