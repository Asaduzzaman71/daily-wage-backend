# add .env file
# set config/config.json
# to run migration 
npx sequelize-cli db:migrate

# to run all seeder 
npx sequelize-cli db:seed:all

# to run in local server 
npm start