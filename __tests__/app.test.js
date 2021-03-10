require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
	describe('routes', () => {
		let token;

		beforeAll(async (done) => {
			execSync('npm run setup-db');

			client.connect();

			const signInData = await fakeRequest(app)
				.post('/auth/signup')
				.send({
					email: 'j@arbuckle.com',
					name: 'john',
					password: '1234',
				});

			token = signInData.body.token; // eslint-disable-line

			return done();
		});

		afterAll((done) => {
			return client.end(done);
		});

		test('returns a 200 response for apod call', async () => {
			await fakeRequest(app).get('/apod').expect('Content-Type', /json/);
		});

		test('returns a munged location object with name, lat and lon from given city', async () => {
			const expectation = {
				name: 'Portland, Multnomah, Oregon, USA',
				lat: '45.5202471',
				lon: '-122.6741949',
			};

			const data = await fakeRequest(app)
				.get('/api/lat-lon?city=portland')
				.set('Authorization', token)
				.expect('Content-Type', /json/)
				.expect(200);

			expect(data.body).toEqual(expectation);
		});

		test('create an observation', async () => {
			const expectation = {
				name: 'mars',
				image: 'http://placekitten.com/200/200',
				notes: 'a beautiful planet',
				observed: true,
			};

			const dbExpectation = {
				...expectation,
				user_id: 2,
				id: 4,
			};

			const data = await fakeRequest(app)
				.post('/api/observations')
				.set('Authorization', token)
				.send(expectation)
				.expect('Content-Type', /json/)
				.expect(200);

			expect(data.body).toEqual(dbExpectation);
		});

		test('get a users observations', async () => {
			const expectation = [
				{
					name: 'mars',
					image: 'http://placekitten.com/200/200',
					notes: 'a beautiful planet',
					observed: true,
					user_id: 2,
					id: 4,
				},
			];

			const data = await fakeRequest(app)
				.get('/api/observations')
				.set('Authorization', token)
				.expect('Content-Type', /json/)
				.expect(200);

			expect(data.body).toEqual(expectation);
		});

		test('update a users observations', async () => {
			const updated = {
				name: 'mars',
				image: 'http://placekitten.com/200/200',
				notes: 'a really really beautiful planet',
				observed: true,
			};

			const expectation = [
				{
					...updated,
					user_id: 2,
					id: 4,
				},
			];

			const data = await fakeRequest(app)
				.put('/api/observations/4')
				.send(updated)
				.set('Authorization', token)
				.expect('Content-Type', /json/)
				.expect(200);

			expect(data.body).toEqual(expectation);
		});

		test('delete a users observations', async () => {
			await fakeRequest(app)
				.delete('/api/observations/4')
				.set('Authorization', token)
				.expect('Content-Type', /json/)
				.expect(200);

			const data = await fakeRequest(app)
				.get('/api/observations')
				.set('Authorization', token)
				.expect('Content-Type', /json/)
				.expect(200);

			expect(data.body).toEqual([]);
		});

		test('returns a munged lookup detail of the supplied celestial object', async () => {
			const expectation = {
				name: 'mirfak',
				referenceOrg: 'Simbad',
				referenceLink:
					'http://simbad.u-strasbg.fr/simbad/sim-id?Ident=mirfak',
				ra: '03:24:19.370',
				dec: '+49:51:40.250',
				galacticCords: '-5.86245, 146.56876',
				image:
					'http://server7.sky-map.org/imgcut?survey=DSS2&w=256&h=256&ra=3.40538055333333&de=49.8611806&angle=1.25&output=PNG',
				category: 'Variable Star',
			};

			const data = await fakeRequest(app)
				.get('/api/lookup?objName=mirfak')
				.set('Authorization', token)
				.expect('Content-Type', /json/)
				.expect(200);

			expect(data.body).toEqual(expectation);
		});
	});
});
