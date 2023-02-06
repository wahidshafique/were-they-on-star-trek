import fs from 'fs';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '../.env' });

const MAX_POPULAR_ITEMS = 24;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const { data } = await supabase
	.from('popular_searches')
	.select('media_id, name, type, image, hits')
	.order('hits', { ascending: false })
	.limit(MAX_POPULAR_ITEMS);

try {
	fs.writeFileSync('../src/routes/popularSearches.json', JSON.stringify(data));
} catch (e) {
	console.error(e);
}
