// Supabase Configuration for CoinWizz
// Project: cryptospace
// Database: PostgreSQL (Supabase)

const SUPABASE_CONFIG = {
    url: 'https://wvochnkftkmvdyetxorj.supabase.co',
    anonKey: 'sb_publishable_Xs0GUQD_c_f_s7nZgkeQ3w_vElVnDxw'
};

// Initialize Supabase client (requires Supabase JS library)
let supabaseClient = null;

function initSupabase() {
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
        supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        console.log('✅ Supabase initialized successfully');
        return supabaseClient;
    } else {
        console.error('❌ Supabase library not loaded. Please include the Supabase JS CDN.');
        return null;
    }
}

// User Management Functions
async function saveUserToSupabase(userData) {
    if (!supabaseClient) {
        console.error('Supabase not initialized');
        return { success: false, error: 'Supabase not initialized' };
    }

    try {
        // Check if user exists
        const { data: existingUser, error: fetchError } = await supabaseClient
            .from('users')
            .select('*')
            .eq('email', userData.email)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            // PGRST116 = no rows returned, which is fine for new users
            console.error('Error checking existing user:', fetchError);
        }

        const userRecord = {
            email: userData.email,
            name: userData.name,
            picture: userData.picture || null,
            plan: userData.plan || 'free',
            auth_provider: userData.authProvider || 'google',
            selected_coins: userData.selectedCoins || [],
            selected_pages: userData.selectedPages || [],
            last_active: new Date().toISOString(),
            metadata: {
                memberSince: userData.memberSince || new Date().toLocaleDateString('de-DE')
            }
        };

        let result;
        if (existingUser) {
            // Update existing user
            const { data, error } = await supabaseClient
                .from('users')
                .update({
                    ...userRecord,
                    updated_at: new Date().toISOString()
                })
                .eq('email', userData.email)
                .select();

            result = { data, error };
        } else {
            // Insert new user
            const { data, error } = await supabaseClient
                .from('users')
                .insert([userRecord])
                .select();

            result = { data, error };
        }

        if (result.error) {
            console.error('Error saving user to Supabase:', result.error);
            return { success: false, error: result.error };
        }

        console.log('✅ User saved to Supabase:', result.data);
        return { success: true, data: result.data };
    } catch (error) {
        console.error('Exception saving user to Supabase:', error);
        return { success: false, error: error.message };
    }
}

async function getAllUsersFromSupabase() {
    if (!supabaseClient) {
        console.error('Supabase not initialized');
        return { success: false, error: 'Supabase not initialized', data: [] };
    }

    try {
        const { data, error } = await supabaseClient
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching users from Supabase:', error);
            return { success: false, error, data: [] };
        }

        console.log(`✅ Fetched ${data.length} users from Supabase`);
        return { success: true, data };
    } catch (error) {
        console.error('Exception fetching users from Supabase:', error);
        return { success: false, error: error.message, data: [] };
    }
}

async function updateUserPlanInSupabase(email, newPlan) {
    if (!supabaseClient) {
        console.error('Supabase not initialized');
        return { success: false, error: 'Supabase not initialized' };
    }

    try {
        const { data, error } = await supabaseClient
            .from('users')
            .update({ 
                plan: newPlan,
                updated_at: new Date().toISOString()
            })
            .eq('email', email)
            .select();

        if (error) {
            console.error('Error updating user plan:', error);
            return { success: false, error };
        }

        console.log('✅ User plan updated:', data);
        return { success: true, data };
    } catch (error) {
        console.error('Exception updating user plan:', error);
        return { success: false, error: error.message };
    }
}

async function deleteUserFromSupabase(email) {
    if (!supabaseClient) {
        console.error('Supabase not initialized');
        return { success: false, error: 'Supabase not initialized' };
    }

    try {
        const { data, error } = await supabaseClient
            .from('users')
            .delete()
            .eq('email', email);

        if (error) {
            console.error('Error deleting user:', error);
            return { success: false, error };
        }

        console.log('✅ User deleted:', email);
        return { success: true, data };
    } catch (error) {
        console.error('Exception deleting user:', error);
        return { success: false, error: error.message };
    }
}

async function getUserByEmail(email) {
    if (!supabaseClient) {
        console.error('Supabase not initialized');
        return { success: false, error: 'Supabase not initialized', data: null };
    }

    try {
        const { data, error } = await supabaseClient
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error) {
            console.error('Error fetching user:', error);
            return { success: false, error, data: null };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Exception fetching user:', error);
        return { success: false, error: error.message, data: null };
    }
}

// Update user's last active timestamp
async function updateUserActivity(email) {
    if (!supabaseClient) return;

    try {
        await supabaseClient
            .from('users')
            .update({ 
                last_active: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('email', email);
    } catch (error) {
        console.error('Error updating user activity:', error);
    }
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SUPABASE_CONFIG,
        initSupabase,
        saveUserToSupabase,
        getAllUsersFromSupabase,
        updateUserPlanInSupabase,
        deleteUserFromSupabase,
        getUserByEmail,
        updateUserActivity
    };
}
