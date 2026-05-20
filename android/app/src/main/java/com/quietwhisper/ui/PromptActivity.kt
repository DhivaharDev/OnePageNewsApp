package com.quietwhisper.ui

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.*
import com.quietwhisper.data.SessionStore
import com.quietwhisper.data.UnlockReason
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class PromptActivity : ComponentActivity() {

    private val store by lazy { SessionStore(applicationContext) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            var screen by remember { mutableStateOf<Screen>(Screen.Prompt) }

            when (val s = screen) {
                Screen.Prompt -> PromptScreen { reason ->
                    CoroutineScope(Dispatchers.IO).launch { store.recordReason(reason) }
                    screen = when (reason) {
                        // Social → show mindfulness suggestions first, then offer app grid
                        UnlockReason.SOCIAL -> Screen.Suggestion

                        // These go straight to the relevant app grid
                        UnlockReason.PAY,
                        UnlockReason.OFFICE,
                        UnlockReason.MUSIC,
                        UnlockReason.MESSAGE -> Screen.AppGrid(reason)

                        // These need no grid — just allow immediately
                        UnlockReason.CALL,
                        UnlockReason.OTHER -> { finish(); Screen.Prompt }
                    }
                }

                Screen.Suggestion -> SuggestionScreen(
                    onDismiss = { finish() },
                    onSaved = {
                        CoroutineScope(Dispatchers.IO).launch { store.incrementSavedSessions() }
                        finish()
                    },
                    // "Open an app instead" → go to Social apps grid
                    onOpenApps = { screen = Screen.AppGrid(UnlockReason.SOCIAL) }
                )

                is Screen.AppGrid -> AppGridScreen(
                    reason = s.reason,
                    onDone  = { finish() },
                    onBack  = { screen = Screen.Prompt }
                )
            }
        }
    }

    sealed class Screen {
        data object Prompt     : Screen()
        data object Suggestion : Screen()
        data class  AppGrid(val reason: UnlockReason) : Screen()
    }
}
