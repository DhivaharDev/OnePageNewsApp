package com.quietwhisper.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.quietwhisper.data.SessionStore
import kotlinx.coroutines.launch

@Composable
fun SettingsScreen(store: SessionStore) {
    val scope = rememberCoroutineScope()
    val unlockCount by store.unlockCount.collectAsState(initial = 0)
    val savedSessions by store.savedSessions.collectAsState(initial = 0)
    val strictMode by store.strictMode.collectAsState(initial = false)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF1A1A2E))
            .padding(24.dp)
    ) {
        Text(
            text = "Your Unlock Stats",
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold,
            color = Color.White
        )

        Spacer(modifier = Modifier.height(32.dp))

        StatCard(label = "Unlocks today", value = unlockCount.toString())
        Spacer(modifier = Modifier.height(16.dp))
        StatCard(label = "Sessions saved (chose mindfulness)", value = savedSessions.toString())

        Spacer(modifier = Modifier.height(40.dp))

        Text(
            text = "Strict Mode",
            fontSize = 20.sp,
            fontWeight = FontWeight.SemiBold,
            color = Color.White
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "When enabled, navigating away from your music app will trigger the prompt again.",
            fontSize = 14.sp,
            color = Color(0xFFB0BEC5)
        )

        Spacer(modifier = Modifier.height(16.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(text = "Enable Strict Mode", color = Color.White, fontSize = 16.sp)
            Switch(
                checked = strictMode,
                onCheckedChange = { scope.launch { store.setStrictMode(it) } },
                colors = SwitchDefaults.colors(checkedThumbColor = Color(0xFF533483))
            )
        }
    }
}

@Composable
private fun StatCard(label: String, value: String) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = Color(0xFF16213E),
        shape = MaterialTheme.shapes.medium
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(text = label, color = Color(0xFFB0BEC5), fontSize = 14.sp)
            Text(text = value, color = Color.White, fontSize = 28.sp, fontWeight = FontWeight.Bold)
        }
    }
}
