package com.quietwhisper.ui

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.RoundRect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Fill
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.dp
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin

@Composable
fun DoodleCanvas(modifier: Modifier = Modifier) {
    val ink   = Color(0xFFB0BEC5)
    val gold  = Color(0xFFFFD54F)
    val lilac = Color(0xFFCE93D8)
    val bubble = Color(0xFF1E2D45)

    Canvas(modifier = modifier
        .fillMaxWidth()
        .height(110.dp)
    ) {
        val w = size.width
        val h = size.height

        // ── Stick figure (left quarter, small) ───────────────────────────
        val cx    = w * 0.20f
        val headR = h * 0.11f          // ~12dp at 110dp canvas height
        val headY = h * 0.62f          // lower part — speech bubble sits above

        // Speech bubble
        val bubL = cx - 38f
        val bubR = cx + 38f
        val bubT = h * 0.02f
        val bubB = h * 0.38f
        val bubblePath = Path().apply {
            addRoundRect(RoundRect(bubL, bubT, bubR, bubB, CornerRadius(10f)))
            // tail pointing down
            moveTo(cx - 9f, bubB)
            lineTo(cx,      bubB + 14f)
            lineTo(cx + 9f, bubB)
            close()
        }
        drawPath(bubblePath, bubble, style = Fill)
        drawPath(bubblePath, ink.copy(alpha = 0.6f), style = Stroke(1.8f))

        // "Hmm?" inside bubble — drawn with native canvas for text
        drawContext.canvas.nativeCanvas.drawText(
            "Hmm?",
            cx,
            (bubT + bubB) / 2f + 6f,
            android.graphics.Paint().apply {
                color        = android.graphics.Color.WHITE
                textSize     = 13f * density
                textAlign    = android.graphics.Paint.Align.CENTER
                isAntiAlias  = true
                isFakeBoldText = true
            }
        )

        // Head
        drawCircle(ink, headR, Offset(cx, headY), style = Stroke(2.2f, cap = StrokeCap.Round))

        // Raised eyebrow (left) — skeptical look
        val browPath = Path().apply {
            moveTo(cx - headR * 0.5f, headY - headR * 0.55f)
            quadraticBezierTo(cx - headR * 0.25f, headY - headR * 0.75f, cx, headY - headR * 0.5f)
        }
        drawPath(browPath, ink, style = Stroke(1.8f, cap = StrokeCap.Round))

        // Eyes
        drawCircle(ink, 2f, Offset(cx - headR * 0.38f, headY - headR * 0.20f))
        drawCircle(ink, 2f, Offset(cx + headR * 0.38f, headY - headR * 0.20f))

        // Mouth (slight frown / neutral)
        val mouthPath = Path().apply {
            moveTo(cx - headR * 0.35f, headY + headR * 0.35f)
            quadraticBezierTo(cx, headY + headR * 0.25f, cx + headR * 0.35f, headY + headR * 0.35f)
        }
        drawPath(mouthPath, ink, style = Stroke(1.8f, cap = StrokeCap.Round))

        // Body
        val bodyTop = headY + headR
        val bodyBot = h * 0.90f
        drawLine(ink, Offset(cx, bodyTop), Offset(cx, bodyBot * 0.73f), 2.2f, cap = StrokeCap.Round)

        // Left arm — raised / waving
        val armWave = Path().apply {
            moveTo(cx, bodyTop + (bodyBot * 0.73f - bodyTop) * 0.35f)
            quadraticBezierTo(
                cx - headR * 1.2f, bodyTop - 4f,
                cx - headR * 1.9f, headY - headR * 0.2f
            )
        }
        drawPath(armWave, ink, style = Stroke(2.2f, cap = StrokeCap.Round))

        // Right arm — down
        drawLine(
            ink,
            Offset(cx, bodyTop + (bodyBot * 0.73f - bodyTop) * 0.35f),
            Offset(cx + headR * 1.5f, bodyTop + (bodyBot * 0.73f - bodyTop) * 0.60f),
            2.2f, cap = StrokeCap.Round
        )

        // Legs
        drawLine(ink, Offset(cx, bodyBot * 0.73f), Offset(cx - headR * 1.0f, bodyBot), 2.2f, cap = StrokeCap.Round)
        drawLine(ink, Offset(cx, bodyBot * 0.73f), Offset(cx + headR * 1.0f, bodyBot), 2.2f, cap = StrokeCap.Round)

        // ── Doodles (right two-thirds) ────────────────────────────────────

        // Stars
        drawStar(Offset(w * 0.50f, h * 0.08f), 9f,  gold)
        drawStar(Offset(w * 0.70f, h * 0.22f), 6f,  gold)
        drawStar(Offset(w * 0.88f, h * 0.06f), 7f,  gold)
        drawStar(Offset(w * 0.62f, h * 0.70f), 8f,  gold)
        drawStar(Offset(w * 0.95f, h * 0.75f), 5f,  gold)

        // Spiral
        drawSpiral(Offset(w * 0.82f, h * 0.52f), lilac, 14f)

        // Bubbles / circles
        drawCircle(lilac, 6f, Offset(w * 0.48f, h * 0.42f), style = Stroke(1.8f))
        drawCircle(lilac, 9f, Offset(w * 0.92f, h * 0.35f), style = Stroke(1.8f))
        drawCircle(gold,  4f, Offset(w * 0.55f, h * 0.88f), style = Stroke(1.6f))

        // Zigzag line
        val zz = Path().apply {
            moveTo(w * 0.46f, h * 0.82f)
            repeat(6) { i ->
                lineTo(w * (0.46f + (i + 1) * 0.07f), h * if (i % 2 == 0) 0.70f else 0.82f)
            }
        }
        drawPath(zz, lilac, style = Stroke(1.8f, cap = StrokeCap.Round))

        // Tiny dots
        drawCircle(ink,  2.5f, Offset(w * 0.75f, h * 0.88f))
        drawCircle(ink,  1.8f, Offset(w * 0.80f, h * 0.94f))
        drawCircle(gold, 2.2f, Offset(w * 0.68f, h * 0.48f))

        // Curved squiggle
        val sq = Path().apply {
            moveTo(w * 0.46f, h * 0.55f)
            cubicTo(w * 0.52f, h * 0.42f, w * 0.58f, h * 0.68f, w * 0.65f, h * 0.55f)
        }
        drawPath(sq, lilac.copy(alpha = 0.7f), style = Stroke(1.6f, cap = StrokeCap.Round))
    }
}

private fun DrawScope.drawStar(center: Offset, r: Float, color: Color) {
    repeat(4) { i ->
        val a = i * 45f * (PI / 180).toFloat()
        drawLine(color,
            Offset(center.x - cos(a) * r, center.y - sin(a) * r),
            Offset(center.x + cos(a) * r, center.y + sin(a) * r),
            strokeWidth = 1.8f, cap = StrokeCap.Round
        )
    }
}

private fun DrawScope.drawSpiral(center: Offset, color: Color, maxR: Float) {
    val path = Path()
    var first = true
    for (i in 0..100) {
        val t = i / 100f
        val a = t * 3f * 2f * PI.toFloat()
        val r = t * maxR
        val x = center.x + cos(a) * r
        val y = center.y + sin(a) * r
        if (first) { path.moveTo(x, y); first = false } else path.lineTo(x, y)
    }
    drawPath(path, color, style = Stroke(1.6f, cap = StrokeCap.Round))
}
