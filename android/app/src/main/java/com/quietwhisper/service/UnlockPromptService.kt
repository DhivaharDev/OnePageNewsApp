package com.quietwhisper.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.IBinder
import com.quietwhisper.data.SessionStore
import com.quietwhisper.ui.PromptActivity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

class UnlockPromptService : Service() {

    companion object {
        const val EXTRA_TRIGGER = "trigger"
        const val TRIGGER_UNLOCK = "unlock"
        private const val CHANNEL_ID = "quietwhisper_fg"
        private const val NOTIF_ID = 1
    }

    private val job = SupervisorJob()
    private val scope = CoroutineScope(Dispatchers.IO + job)

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        startForeground(NOTIF_ID, buildNotification())
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent?.getStringExtra(EXTRA_TRIGGER) == TRIGGER_UNLOCK) {
            scope.launch {
                SessionStore(applicationContext).incrementUnlockCount()
            }
            val promptIntent = Intent(this, PromptActivity::class.java).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
            }
            startActivity(promptIntent)
        }
        stopSelf(startId)
        return START_NOT_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        super.onDestroy()
        job.cancel()
    }

    private fun createNotificationChannel() {
        val channel = NotificationChannel(
            CHANNEL_ID,
            "QuietWhisper",
            NotificationManager.IMPORTANCE_LOW
        )
        getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
    }

    private fun buildNotification(): Notification =
        Notification.Builder(this, CHANNEL_ID)
            .setContentTitle("QuietWhisper active")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .build()
}
