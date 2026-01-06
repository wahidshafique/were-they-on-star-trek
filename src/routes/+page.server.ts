import { API_KEY, SUPABASE_SERVICE_KEY, SUPABASE_URL } from '$env/static/private';
import type { PageServerLoad } from './$types';
import { createClient } from '@supabase/supabase-js';
import type { Actions } from './$types';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export const actions = {
    clickedBadge: async (event) => {
        return await supabase.rpc('incrementBadgeClicked')
    }
} satisfies Actions;

export const load: PageServerLoad = async ({ params, fetch, cookies, url }) => {
    const { data } = await supabase
        .from('fun_bits')
        .select('data_point_name, number_of_times')

    const formattedData = data?.reduce((acc, data) => {
        acc[data.data_point_name] = {
            numberOfTimes: data.number_of_times
        }
        return acc
    }, {})
    return formattedData
}