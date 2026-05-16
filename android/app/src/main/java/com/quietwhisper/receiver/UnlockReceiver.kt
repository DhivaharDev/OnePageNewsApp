package com.quietwhisper.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.quietwhisper.service.UnlockPromptService

class UnlockReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        when (intent.action) {
            Intent.ACTION_USER_PRESENT -> {
                val serviceIntent = Intent(context, UnlockPromptService::class.java)
                    .putExtra(UnlockPromptService.EXTRA_TRIGGER, UnlockPromptService.TRIGGER_UNLOCK)
                context.startForegroundService(serviceIntent)
            }
            Intent.ACTION_BOOT_COMPLETED -> {
                // Service restarts itself; no action needed on boot beyond this hook
            }
        }
    }
}
