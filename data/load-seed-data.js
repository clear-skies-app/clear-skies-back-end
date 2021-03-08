const client = require('../lib/client');
// import our seed data:
const observations = require('./observations.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, name, hash)
                      VALUES ($1, $2, $3)
                      RETURNING *;
                  `,
        [user.email, user.name, user.hash]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      observations.map(item => {
        return client.query(`
                    INSERT INTO observations (
                      name, 
                      image, 
                      notes,
                      observed, 
                      user_id)
                    VALUES ($1, $2, $3, $4, $5);
                `,
        [
          item.name,
          item.image, 
          item.notes, 
          item.observed, 
          user.id]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
