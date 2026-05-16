package com.quietwhisper.ui

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
import kotlinx.coroutines.delay

private const val POMODORO_SECONDS = 25 * 60

@Composable
fun FocusTimerScreen(onDone: () -> Unit) {
    var secondsLeft by remember { mutableIntStateOf(POMODORO_SECONDS) }
    var running by remember { mutableStateOf(true) }

    LaunchedEffect(running) {
        while (running && secondsLeft > 0) {
            delay(1000)
            secondsLeft--
        }
        if (secondsLeft == 0) onDone()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF1A1A2E))
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Focus Session",
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFFB0BEC5)
        )

        Spacer(modifier = Modifier.height(24.dp))

        val minutes = secondsLeft / 60
        val seconds = secondsLeft % 60
        Text(
            text = "${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}",
            fontSize = 72.sp,
            fontWeight = FontWeight.Bold,
            color = Color.White,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(24.dp))

        LinearProgressIndicator(
            progress = { 1f - secondsLeft.toFloat() / POMODORO_SECONDS },
            modifier = Modifier.fillMaxWidth(),
            color = Color(0xFF533483)
        )

        Spacer(modifier = Modifier.height(32.dp))

        Button(
            onClick = { running = !running },
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF533483))
        ) {
            Text(if (running) "Pause" else "Resume", color = Color.White)
        }

        Spacer(modifier = Modifier.height(16.dp))

        TextButton(onClick = onDone) {
            Text("End session early", color = Color(0xFF78909C))
        }
    }
}
