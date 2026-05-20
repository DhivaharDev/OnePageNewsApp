package com.quietwhisper.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Air
import androidx.compose.material.icons.filled.FitnessCenter
import androidx.compose.material.icons.filled.SelfImprovement
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay

@Composable
fun SuggestionScreen(
    onDismiss: () -> Unit,
    onSaved: () -> Unit,
    onOpenApps: () -> Unit
) {
    var timerSeconds by remember { mutableIntStateOf(0) }
    var timerRunning by remember { mutableStateOf(false) }

    LaunchedEffect(timerRunning) {
        if (timerRunning) {
            while (timerRunning && timerSeconds < 120) {
                delay(1000)
                timerSeconds++
            }
            if (timerSeconds >= 120) {
                timerRunning = false
                onSaved()
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0F3460))
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Put the phone down.",
            fontSize = 26.sp,
            fontWeight = FontWeight.Bold,
            color = Color.White,
            textAlign = TextAlign.Center
        )

        Spacer(Modifier.height(6.dp))

        Text(
            text = "Try one of these instead:",
            fontSize = 15.sp,
            color = Color(0xFFB0BEC5),
            textAlign = TextAlign.Center
        )

        Spacer(Modifier.height(24.dp))

        SuggestionItem(icon = Icons.Default.SelfImprovement, text = "2-min meditation")
        Spacer(Modifier.height(12.dp))
        SuggestionItem(icon = Icons.Default.FitnessCenter, text = "3 pushups")
        Spacer(Modifier.height(12.dp))
        SuggestionItem(icon = Icons.Default.Air, text = "Deep breathing")

        Spacer(Modifier.height(28.dp))

        if (!timerRunning && timerSeconds == 0) {
            Button(
                onClick = { timerRunning = true },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF533483))
            ) {
                Text("Start 2-min timer", color = Color.White)
            }
        } else {
            val remaining = 120 - timerSeconds
            Text(
                text = "${remaining / 60}:${(remaining % 60).toString().padStart(2, '0')}",
                fontSize = 44.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
            Spacer(Modifier.height(8.dp))
            LinearProgressIndicator(
                progress = { timerSeconds / 120f },
                modifier = Modifier.fillMaxWidth(),
                color = Color(0xFF533483)
            )
        }

        Spacer(Modifier.height(20.dp))

        // Allow them to still open the app
        OutlinedButton(
            onClick = onOpenApps,
            colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFF90CAF9))
        ) {
            Text("Open an app instead →")
        }

        Spacer(Modifier.height(8.dp))

        TextButton(onClick = onDismiss) {
            Text("I'll use the phone anyway", color = Color(0xFF78909C))
        }
    }
}

@Composable
private fun SuggestionItem(icon: ImageVector, text: String) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        color = Color(0xFF16213E)
    ) {
        Row(
            modifier = Modifier.padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(imageVector = icon, contentDescription = null, tint = Color(0xFF533483))
            Spacer(Modifier.width(14.dp))
            Text(text = text, fontSize = 15.sp, color = Color.White)
        }
    }
}
