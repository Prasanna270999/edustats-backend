# Start MongoDB
Start-Process -NoNewWindow -FilePath "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" -ArgumentList "--dbpath C:\data\db"

# Wait 5 seconds to let MongoDB start
Start-Sleep -Seconds 5

# Start backend server using nodemon
Start-Process -NoNewWindow -FilePath "cmd.exe" -ArgumentList "/c nodemon server.js"
