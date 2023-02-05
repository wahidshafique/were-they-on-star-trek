import fs from 'fs';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '../.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const { data } = await supabase
	.from('popular_searches')
	.select('media_id, name, type, image, hits')
	.order('hits', { ascending: false })
	.limit(10);

try {
	fs.writeFileSync('../src/routes/popularSearches.json', JSON.stringify(data));
} catch (e) {
	console.error(e);
}
