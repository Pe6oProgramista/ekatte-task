const { Client } = require('pg');
const readline = require('readline');

const client = new Client({
	user: process.env.DB_USER,
	host: 'localhost',
	database: process.env.DB_NAME,
	password: process.env.DB_PASS,
	port: 5432,
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', async function (input) {
    let name =  input;
    rl.close();
    
	await client.connect();

    let sql = `SELECT k.t_v_m "Тип селище", a.name "Селище", obs.name "Община", obl.name "Област" from atte a
        inner join kind k on a.kind = k.kind
        inner join obstina obs on a.obstina = obs.obstina
        inner join oblast obl on obs.oblast = obl.oblast
    WHERE a.name like '%${name}%'`;

	let res = await client.query(sql);
	Object.keys(res.rows[0]).map( key => console.log(`${key}: ${res.rows[0][key]}`) );

	await client.end();

	return 0;
});