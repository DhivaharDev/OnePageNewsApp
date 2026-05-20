package com.quietwhisper.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.quietwhisper.data.UnlockReason

private val reasonIcon: Map<UnlockReason, ImageVector> = mapOf(
    UnlockReason.SOCIAL  to Icons.Default.Language,
    UnlockReason.PAY     to Icons.Default.CreditCard,
    UnlockReason.OFFICE  to Icons.Default.Work,
    UnlockReason.MUSIC   to Icons.Default.MusicNote,
    UnlockReason.CALL    to Icons.Default.Phone,
    UnlockReason.MESSAGE to Icons.Default.Message,
    UnlockReason.OTHER   to Icons.Default.MoreHoriz,
)

@Composable
fun PromptScreen(onReasonSelected: (UnlockReason) -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0D1117))
            .padding(horizontal = 14.dp, vertical = 10.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Small doodle with stick figure
        DoodleCanvas(
            modifier = Modifier
                .fillMaxWidth()
                .height(110.dp)
        )

        Spacer(Modifier.height(4.dp))

        // Smaller question text
        Text(
            text = "Why are you opening your phone?",
            fontSize = 15.sp,
            fontWeight = FontWeight.Medium,
            color = Color.White,
            textAlign = TextAlign.Center,
            lineHeight = 21.sp
        )

        Spacer(Modifier.height(10.dp))

        // Non-scrolling 2-column grid — uses weight so all rows share remaining height equally
        val rows = UnlockReason.entries.chunked(2)
        rows.forEachIndexed { rowIndex, pair ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                pair.forEach { reason ->
                    ReasonCard(
                        reason = reason,
                        icon = reasonIcon[reason] ?: Icons.Default.MoreHoriz,
                        modifier = Modifier
                            .weight(1f)
                            .fillMaxHeight(),
                        onClick = { onReasonSelected(reason) }
                    )
                }
                // If odd number of items in last row, fill remaining space
                if (pair.size == 1) {
                    Spacer(modifier = Modifier.weight(1f))
                }
            }
            if (rowIndex < rows.lastIndex) {
                Spacer(Modifier.height(8.dp))
            }
        }
    }
}

@Composable
private fun ReasonCard(
    reason: UnlockReason,
    icon: ImageVector,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(16.dp))
            .background(Color(0xFF1C2B3A))
            .clickable(onClick = onClick),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(
                imageVector = icon,
                contentDescription = reason.label,
                tint = Color(0xFF90CAF9),
                modifier = Modifier.size(26.dp)
            )
            Spacer(Modifier.height(6.dp))
            Text(
                text = reason.label,
                fontSize = 13.sp,
                color = Color.White,
                textAlign = TextAlign.Center,
                lineHeight = 17.sp
            )
        }
    }
}
