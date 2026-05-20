package com.quietwhisper.ui

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.quietwhisper.data.AppCategory
import com.quietwhisper.data.UnlockReason

@Composable
fun AppGridScreen(
    reason: UnlockReason,
    onDone: () -> Unit,
    onBack: () -> Unit
) {
    val context = LocalContext.current
    val apps = remember(reason) { loadInstalledApps(context, reason) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0D1117))
            .padding(horizontal = 20.dp, vertical = 16.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            TextButton(onClick = onBack) {
                Text("← Back", color = Color(0xFF78909C), fontSize = 14.sp)
            }
            Spacer(Modifier.width(4.dp))
            Text(
                text = reason.label,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
        }

        Spacer(Modifier.height(12.dp))

        if (apps.isEmpty()) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text(
                    text = "No apps found for this category.\nInstall relevant apps to see them here.",
                    color = Color(0xFF78909C),
                    textAlign = TextAlign.Center,
                    lineHeight = 22.sp
                )
            }
        } else {
            LazyVerticalGrid(
                columns = GridCells.Fixed(3),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(apps) { app ->
                    AppTile(app = app, onClick = {
                        launchApp(context, app.pkg)
                        onDone()
                    })
                }
            }
        }
    }
}

@Composable
private fun AppTile(app: InstalledApp, onClick: () -> Unit) {
    Column(
        modifier = Modifier
            .clip(RoundedCornerShape(14.dp))
            .background(Color(0xFF1C2B3A))
            .clickable(onClick = onClick)
            .padding(vertical = 14.dp, horizontal = 8.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        if (app.icon != null) {
            Image(
                bitmap = app.icon,
                contentDescription = app.label,
                modifier = Modifier.size(44.dp)
            )
        } else {
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .background(Color(0xFF533483), RoundedCornerShape(10.dp))
            )
        }
        Spacer(Modifier.height(6.dp))
        Text(
            text = app.label,
            fontSize = 11.sp,
            color = Color.White,
            textAlign = TextAlign.Center,
            maxLines = 2,
            lineHeight = 14.sp
        )
    }
}

private data class InstalledApp(val pkg: String, val label: String, val icon: ImageBitmap?)

private fun loadInstalledApps(context: Context, reason: UnlockReason): List<InstalledApp> {
    val known = AppCategory.apps[reason] ?: return emptyList()
    return known.mapNotNull { knownApp ->
        try {
            context.packageManager.getPackageInfo(knownApp.pkg, 0)
            val info  = context.packageManager.getApplicationInfo(knownApp.pkg, 0)
            val label = context.packageManager.getApplicationLabel(info).toString()
            InstalledApp(knownApp.pkg, label, appIcon(context, knownApp.pkg))
        } catch (_: PackageManager.NameNotFoundException) { null }
    }
}

private fun appIcon(context: Context, pkg: String): ImageBitmap? = try {
    val drawable = context.packageManager.getApplicationIcon(pkg)
    val w   = drawable.intrinsicWidth.coerceAtLeast(48)
    val h   = drawable.intrinsicHeight.coerceAtLeast(48)
    val bmp = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888)
    val cv  = android.graphics.Canvas(bmp)
    drawable.setBounds(0, 0, w, h)
    drawable.draw(cv)
    bmp.asImageBitmap()
} catch (_: Exception) { null }

private fun launchApp(context: Context, pkg: String) {
    context.packageManager.getLaunchIntentForPackage(pkg)?.let { intent ->
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(intent)
    }
}
