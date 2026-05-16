package com.quietwhisper

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.quietwhisper.data.SessionStore
import com.quietwhisper.ui.SettingsScreen

class MainActivity : ComponentActivity() {

    private val store by lazy { SessionStore(applicationContext) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            var tab by remember { mutableIntStateOf(0) }

            Scaffold(
                containerColor = Color(0xFF1A1A2E),
                bottomBar = {
                    NavigationBar(containerColor = Color(0xFF16213E)) {
                        NavigationBarItem(
                            selected = tab == 0,
                            onClick = { tab = 0 },
                            label = { Text("Home", color = Color.White) },
                            icon = {}
                        )
                        NavigationBarItem(
                            selected = tab == 1,
                            onClick = { tab = 1 },
                            label = { Text("Settings", color = Color.White) },
                            icon = {}
                        )
                    }
                }
            ) { padding ->
                Box(modifier = Modifier.padding(padding)) {
                    when (tab) {
                        0 -> HomeScreen(
                            onGrantOverlay = { requestOverlayPermission() },
                            onGrantUsage = { requestUsagePermission() }
                        )
                        1 -> SettingsScreen(store = store)
                    }
                }
            }
        }
    }

    private fun requestOverlayPermission() {
        startActivity(
            Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:$packageName"))
        )
    }

    private fun requestUsagePermission() {
        startActivity(Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS))
    }
}

@Composable
private fun HomeScreen(onGrantOverlay: () -> Unit, onGrantUsage: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF1A1A2E))
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "QuietWhisper",
            fontSize = 32.sp,
            fontWeight = FontWeight.Bold,
            color = Color.White,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "Mindful phone usage starts at unlock.",
            fontSize = 16.sp,
            color = Color(0xFFB0BEC5),
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(48.dp))

        Text(
            text = "Grant the following permissions to activate:",
            fontSize = 14.sp,
            color = Color(0xFF78909C),
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = onGrantOverlay,
            modifier = Modifier.fillMaxWidth(),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF533483))
        ) {
            Text("Grant Overlay Permission", color = Color.White)
        }

        Spacer(modifier = Modifier.height(12.dp))

        Button(
            onClick = onGrantUsage,
            modifier = Modifier.fillMaxWidth(),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF533483))
        ) {
            Text("Grant Usage Access", color = Color.White)
        }
    }
}
