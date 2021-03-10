const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');
const request = require('superagent');
const { mungeApod, mungeLocation, mungeLookup } = require('./api-utils.js');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route.
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
	res.json({
		message: `in this proctected route, we get the user's id like so: ${req.userId}`,
	});
});

app.get('/observations', async (req, res) => {
	try {
		const data = await client.query('SELECT * from observations');

		res.json(data.rows);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.get('/apod', async (req, res) => {
	try {
		const data = await request.get(
			`https://api.nasa.gov/planetary/apod?count=10&thumbs=true&api_key=${process.env.NASA_API_KEY}`
		);

		res.json(mungeApod(data.body));
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.get('/api/lat-lon', async (req, res) => {
	const city = req.query.city;
	try {
		const data = await request.get(`https://us1.locationiq.com/v1/search.php?key=${process.env.LOCATION_IQ}&q=${city}&format=json
    `);

		res.json(mungeLocation(data.body));
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.post('/api/observations', async (req, res) => {
	try {
		const data = await client.query(
			`
    INSERT INTO observations (name, image, notes, observed, user_id)
    VALUES ($1, $2, $3, true, $4)
    RETURNING *
    `,
			[req.body.name, req.body.image, req.body.notes, req.userId]
		);

		res.json(data.rows[0]);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.get('/api/observations', async (req, res) => {
	try {
		const data = await client.query(
			`
    SELECT *
    FROM observations
    WHERE user_id=$1`,
			[req.userId]
		);

		res.json(data.rows);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.put('/api/observations/:id', async (req, res) => {
	try {
		const data = await client.query(
			`
    UPDATE observations
    SET notes=$1
    WHERE user_id=$2
    AND id=$3
    RETURNING *`,
			[req.body.notes, req.userId, req.params.id]
		);

		res.json(data.rows);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.delete('/api/observations/:id', async (req, res) => {
	try {
		const data = await client.query(
			`
    DELETE FROM observations
    WHERE id=$1
    AND user_id=$2
    RETURNING *
    `,
			[req.params.id, req.userId]
		);

		res.json(data.rows[0]);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.get('/api/lookup', async (req, res) => {
	const objName = req.query.objName;
	try {
		const data = await request.get(
			`https://www.strudel.org.uk/lookUP/json/?name=${objName}`
		);

		res.json(mungeLookup(JSON.parse(data.text)));
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.use(require('./middleware/error'));

module.exports = app;
