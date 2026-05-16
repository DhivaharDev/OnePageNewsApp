package com.quietwhisper.data

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.longPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "session")

class SessionStore(private val context: Context) {

    companion object {
        private val KEY_UNLOCK_COUNT = intPreferencesKey("unlock_count")
        private val KEY_LAST_RESET_DAY = longPreferencesKey("last_reset_day")
        private val KEY_STRICT_MODE = booleanPreferencesKey("strict_mode")
        private val KEY_STRICT_APP = stringPreferencesKey("strict_app")
        private val KEY_SAVED_SESSIONS = intPreferencesKey("saved_sessions")
        private val KEY_REASONS_JSON = stringPreferencesKey("reasons_json")
    }

    val unlockCount: Flow<Int> = context.dataStore.data.map { it[KEY_UNLOCK_COUNT] ?: 0 }
    val strictMode: Flow<Boolean> = context.dataStore.data.map { it[KEY_STRICT_MODE] ?: false }
    val strictApp: Flow<String> = context.dataStore.data.map { it[KEY_STRICT_APP] ?: "" }
    val savedSessions: Flow<Int> = context.dataStore.data.map { it[KEY_SAVED_SESSIONS] ?: 0 }
    val reasonsJson: Flow<String> = context.dataStore.data.map { it[KEY_REASONS_JSON] ?: "" }

    suspend fun incrementUnlockCount() {
        context.dataStore.edit { prefs ->
            val today = System.currentTimeMillis() / 86_400_000L
            val lastReset = prefs[KEY_LAST_RESET_DAY] ?: 0L
            if (today != lastReset) {
                prefs[KEY_UNLOCK_COUNT] = 1
                prefs[KEY_LAST_RESET_DAY] = today
            } else {
                prefs[KEY_UNLOCK_COUNT] = (prefs[KEY_UNLOCK_COUNT] ?: 0) + 1
            }
        }
    }

    suspend fun recordReason(reason: UnlockReason) {
        context.dataStore.edit { prefs ->
            val existing = prefs[KEY_REASONS_JSON] ?: ""
            val updated = if (existing.isEmpty()) reason.name else "$existing,${reason.name}"
            prefs[KEY_REASONS_JSON] = updated
        }
    }

    suspend fun incrementSavedSessions() {
        context.dataStore.edit { prefs ->
            prefs[KEY_SAVED_SESSIONS] = (prefs[KEY_SAVED_SESSIONS] ?: 0) + 1
        }
    }

    suspend fun setStrictMode(enabled: Boolean) {
        context.dataStore.edit { it[KEY_STRICT_MODE] = enabled }
    }

    suspend fun setStrictApp(packageName: String) {
        context.dataStore.edit { it[KEY_STRICT_APP] = packageName }
    }
}
