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
	await client.connect();
	const res = await client.query('SELECT NOW()');
	await client.end();

	let workbook = XLSX.readFile('./files/Ek_atte.xlsx', { sheetRows: 4 }); // , { sheetRows: 3 }
	let sheetsList = workbook.SheetNames;
	let atteData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetsList[0]], {
		header: 1,
		defval: '',
		blankrows: true
	});
	let keys = atteData[0];
	atteData.splice(0, 2);

	atteData = atteData.map((row) => {
		return Object.assign({}, ...row
			.map((v, i) => {
				return { [keys[i]]: v };
			}));
	});

	let kindData = atteData.map( (row) => {
		return { kind: row['kind'], t_V_m: row['t_v_m'] } 
	});

	atteData = atteData.map( (row) => {
		return {
			ekatte: row['ekatte'],
			name: row['name'],
			obstina: row['obstina'],
			kind: row['kind']
		}
	} )

	console.log(atteData);

	return 0;
}

main();