package com.quietwhisper.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.quietwhisper.data.UnlockReason

@Composable
fun PromptScreen(onReasonSelected: (UnlockReason) -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF1A1A2E))
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Why are you opening\nyour phone?",
            fontSize = 26.sp,
            fontWeight = FontWeight.Bold,
            color = Color.White,
            textAlign = TextAlign.Center,
            lineHeight = 34.sp
        )

        Spacer(modifier = Modifier.height(40.dp))

        UnlockReason.entries.forEach { reason ->
            ReasonCard(reason = reason, onClick = { onReasonSelected(reason) })
            Spacer(modifier = Modifier.height(12.dp))
        }
    }
}

@Composable
private fun ReasonCard(reason: UnlockReason, onClick: () -> Unit) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(12.dp),
        color = Color(0xFF16213E),
        tonalElevation = 4.dp
    ) {
        Text(
            text = reason.label,
            modifier = Modifier.padding(horizontal = 20.dp, vertical = 16.dp),
            fontSize = 16.sp,
            color = Color.White
        )
    }
}
