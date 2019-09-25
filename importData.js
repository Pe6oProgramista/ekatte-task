/*
sudo apt-get install postgresql
sudo -u postgres psql
CREATE ROLE ekatte_user LOGIN PASSWORD '';
ALTER USER ekatte_user CREATEDB;
\q
psql postgres -f EKKATE_DB.sql -U ekatte_user -W

DB_USER=ekatte_user DB_NAME=ekatte DB_PASS= node importData.js
*/

const { Client } = require('pg');
const XLSX = require('xlsx');

const client = new Client({
	user: process.env.DB_USER,
	host: 'localhost',
	database: process.env.DB_NAME,
	password: process.env.DB_PASS,
	port: 5432,
});

async function main() {
	let oblData = readXLSX('./files/Ek_obl.xlsx');
	let obstData = readXLSX('./files/Ek_obst.xlsx');
	let atteData = readXLSX('./files/Ek_atte.xlsx');
	atteData.splice(0, 1);

	let oblFields = ['oblast', 'name'];
	let obstFields = ['obstina', 'name', 'oblast'];
	let kindFields = ['kind', 't_v_m'];
	let atteFields = ['ekatte', 'name', 'obstina', 'kind'];

	oblData = oblData.map( (row) => oblFields.map(v => row[v]) );
	obstData = obstData.map( (row) => obstFields.map(v => (v != 'oblast')? row[v] : row['obstina'].slice(0, 3)) );
	kindData = atteData.map( (row) => kindFields.map(v => row[v]) );
	atteData = atteData.map( (row) => atteFields.map(v => row[v]) );

	await client.connect();
	await insertData(oblData, oblFields, 'oblast');
	await insertData(obstData, obstFields, 'obstina');
	await insertData(kindData, kindFields, 'kind');
	await insertData(atteData, atteFields, 'atte');

	let sql = `SELECT
		(SELECT COUNT(*) FROM oblast) AS "oblast Cnt",
		(SELECT COUNT(*) FROM obstina) AS "obstina Cnt",
		(SELECT COUNT(*) FROM kind) AS "kind Cnt",
		(SELECT COUNT(*) FROM atte) AS "atte Cnt"
	FROM now()`;
	let res = await client.query(sql);
	Object.keys(res.rows[0]).map( key => console.log(`${key}: ${res.rows[0][key]}`) );

	await client.end();

	return 0;
}

function readXLSX(file) {
	let workbook = XLSX.readFile(file); // , { sheetRows: 3 }
	let sheetsList = workbook.SheetNames;
	let data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetsList[0]], {
		header: 1,
		defval: '',
		blankrows: true
	});
	let keys = data[0];
	data.splice(0, 1);

	return data.map( (row) => {
		return Object.assign( {}, ...row.map( (v, i) => {
			return { [keys[i]]: v };
		} ) );
	} );
}

async function insertData(data, fields, table) {
	let sql = `INSERT INTO "${table}" (${fields.join(',')}) VALUES`;
	for (let i = 0; i < data.length; i++) {
		sql += ' (';
		let arr = [];
		for(let j = 0; j < fields.length; j++) {
			arr.push(`$${j + 1 + i * fields.length}`);
		}
		sql += arr.join(',') + ')';
		if(i != data.length - 1) sql += ',';
	}
	sql += ' ON CONFLICT DO NOTHING;'; // SELECT * FROM UNNEST ($1::varchar[], $2::varchar[])
	return client.query(sql, data.reduce((res, cur) => res.concat(cur)));
}

main();