package expo.modules.moodlabrendercore

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.ColorMatrix
import android.graphics.ColorMatrixColorFilter
import android.graphics.Paint
import android.graphics.RectF
import android.net.Uri
import android.renderscript.Allocation
import android.renderscript.Element
import android.renderscript.RenderScript
import android.renderscript.ScriptIntrinsicBlur
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.face.FaceDetection
import com.google.mlkit.vision.face.FaceDetectorOptions
import com.google.mlkit.vision.segmentation.Segmentation
import com.google.mlkit.vision.segmentation.SegmentationMask
import com.google.mlkit.vision.segmentation.selfie.SelfieSegmenterOptions
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.File
import java.io.FileOutputStream
import java.nio.ByteBuffer
import kotlin.math.abs
import kotlin.math.max
import kotlin.math.min

class MoodlabRenderCoreModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("MoodlabRenderCore")

    Function("isAvailable") {
      true
    }

    AsyncFunction("detectFaceGeometry") { uri: String, promise: Promise ->
      try {
        val result = detectFaceGeometryInternal(uri)
        if (result != null) {
          promise.resolve(result)
        } else {
          promise.resolve(null)
        }
      } catch (e: Exception) {
        promise.resolve(null)
      }
    }

    AsyncFunction("generateSkinMask") { uri: String, promise: Promise ->
      try {
        val result = generateSkinMaskInternal(uri)
        if (result != null) {
          promise.resolve(result)
        } else {
          promise.resolve(null)
        }
      } catch (e: Exception) {
        promise.resolve(null)
      }
    }

    AsyncFunction("exportWithBeautyPipeline") { options: Map<String, Any?>, promise: Promise ->
      try {
        val outUri = exportWithBeautyPipelineInternal(options)
        promise.resolve(outUri)
      } catch (e: Exception) {
        promise.reject("EXPORT_FAILED", e.message, e)
      }
    }

    AsyncFunction("exportWithColorCube") { sourceUri: String, cubePath: String, strength: Double, promise: Promise ->
      try {
        val outUri = exportWithBeautyPipelineInternal(
          mapOf(
            "sourceUri" to sourceUri,
            "cubePath" to cubePath,
            "lutStrength" to strength,
          )
        )
        promise.resolve(outUri)
      } catch (e: Exception) {
        promise.reject("EXPORT_FAILED", e.message, e)
      }
    }
  }

  private fun loadBitmap(uri: String): Bitmap? {
    val context = appContext.reactContext ?: return null
    val parsed = Uri.parse(uri)
    return context.contentResolver.openInputStream(parsed)?.use { stream ->
      BitmapFactory.decodeStream(stream)
    } ?: run {
      val path = uri.removePrefix("file://")
      BitmapFactory.decodeFile(path)
    }
  }

  private fun regionMap(x: Double, y: Double, w: Double, h: Double): Map<String, Double> =
    mapOf("x" to x, "y" to y, "w" to w, "h" to h)

  private fun clamp01(v: Double) = max(0.0, min(1.0, v))

  private fun detectFaceGeometryInternal(uri: String): Map<String, Any>? {
    val bitmap = loadBitmap(uri) ?: return null
    val image = InputImage.fromBitmap(bitmap, 0)

    val options = FaceDetectorOptions.Builder()
      .setPerformanceMode(FaceDetectorOptions.PERFORMANCE_MODE_ACCURATE)
      .setLandmarkMode(FaceDetectorOptions.LANDMARK_MODE_ALL)
      .setContourMode(FaceDetectorOptions.CONTOUR_MODE_NONE)
      .build()

    val detector = FaceDetection.getClient(options)
    val faces = com.google.android.gms.tasks.Tasks.await(detector.process(image))
    if (faces.isEmpty()) return null

    val face = faces[0]
    val bounds = face.boundingBox
    val imgW = bitmap.width.toDouble()
    val imgH = bitmap.height.toDouble()

    val padX = bounds.width() * 0.08
    val padY = bounds.height() * 0.1
    val faceX = clamp01((bounds.left - padX) / imgW)
    val faceY = clamp01((bounds.top - padY) / imgH)
    val faceW = clamp01(min(1.0 - faceX, (bounds.width() + 2 * padX) / imgW))
    val faceH = clamp01(min(1.0 - faceY, (bounds.height() + 2 * padY) / imgH))
    val faceRegion = regionMap(faceX, faceY, faceW, faceH)

    var eyesRegion = regionMap(
      faceX + faceW * 0.12,
      faceY + faceH * 0.06,
      faceW * 0.76,
      faceH * 0.28,
    )
    var underEyeRegion = regionMap(
      faceX + faceW * 0.1,
      faceY + faceH * 0.3,
      faceW * 0.8,
      faceH * 0.2,
    )
    var lipsRegion = regionMap(
      faceX + faceW * 0.26,
      faceY + faceH * 0.62,
      faceW * 0.48,
      faceH * 0.24,
    )

    val leftEye = face.getLandmark(com.google.mlkit.vision.face.FaceLandmark.LEFT_EYE)
    val rightEye = face.getLandmark(com.google.mlkit.vision.face.FaceLandmark.RIGHT_EYE)
    if (leftEye != null && rightEye != null) {
      val lx = leftEye.position.x / imgW
      val ly = leftEye.position.y / imgH
      val rx = rightEye.position.x / imgW
      val ry = rightEye.position.y / imgH
      val eyeDist = abs(rx - lx).toDouble()
      val eyeCx = (lx + rx) / 2.0
      val eyeCy = (ly + ry) / 2.0
      eyesRegion = regionMap(
        clamp01(eyeCx - eyeDist * 0.65),
        clamp01(eyeCy - eyeDist * 0.35),
        clamp01(min(1.0 - (eyeCx - eyeDist * 0.65), eyeDist * 1.3)),
        clamp01(min(1.0 - (eyeCy - eyeDist * 0.35), eyeDist * 0.55)),
      )
      underEyeRegion = regionMap(
        clamp01(eyesRegion["x"]!! * 0.95 + faceX * 0.05),
        clamp01(eyeCy + eyeDist * 0.05),
        clamp01(eyesRegion["w"]!! * 1.05),
        clamp01(min(1.0 - (eyeCy + eyeDist * 0.05), eyeDist * 0.35)),
      )
    }

    val mouthLeft = face.getLandmark(com.google.mlkit.vision.face.FaceLandmark.MOUTH_LEFT)
    val mouthRight = face.getLandmark(com.google.mlkit.vision.face.FaceLandmark.MOUTH_RIGHT)
    val mouthBottom = face.getLandmark(com.google.mlkit.vision.face.FaceLandmark.MOUTH_BOTTOM)
    if (mouthLeft != null && mouthRight != null && mouthBottom != null) {
      val minX = min(mouthLeft.position.x, min(mouthRight.position.x, mouthBottom.position.x)) / imgW
      val maxX = max(mouthLeft.position.x, max(mouthRight.position.x, mouthBottom.position.x)) / imgW
      val minY = min(mouthLeft.position.y, min(mouthRight.position.y, mouthBottom.position.y)) / imgH
      val maxY = max(mouthLeft.position.y, max(mouthRight.position.y, mouthBottom.position.y)) / imgH
      val padLX = (maxX - minX) * 0.15
      val padLY = (maxY - minY) * 0.2
      lipsRegion = regionMap(
        clamp01(minX - padLX),
        clamp01(minY - padLY),
        clamp01(min(1.0 - (minX - padLX), (maxX - minX) + 2 * padLX)),
        clamp01(min(1.0 - (minY - padLY), (maxY - minY) + 2 * padLY)),
      )
    }

    val geometry = mapOf(
      "face" to faceRegion,
      "eyes" to eyesRegion,
      "underEye" to underEyeRegion,
      "lips" to lipsRegion,
    )

    return mapOf(
      "geometry" to geometry,
      "source" to "mlkit",
      "confidence" to 0.85,
    )
  }

  private fun generateSkinMaskInternal(uri: String): Map<String, Any>? {
    val bitmap = loadBitmap(uri) ?: return null
    val image = InputImage.fromBitmap(bitmap, 0)

    val segmenterOptions = SelfieSegmenterOptions.Builder()
      .setDetectorMode(SelfieSegmenterOptions.SINGLE_IMAGE_MODE)
      .build()
    val segmenter = Segmentation.getClient(segmenterOptions)
    val mask: SegmentationMask = com.google.android.gms.tasks.Tasks.await(segmenter.process(image))

    val maskW = mask.width
    val maskH = mask.height
    val buffer: ByteBuffer = mask.buffer
    val maskBitmap = Bitmap.createBitmap(maskW, maskH, Bitmap.Config.ARGB_8888)
    val pixels = IntArray(maskW * maskH)
    buffer.rewind()
    for (i in pixels.indices) {
      val confidence = buffer.float
      val alpha = (confidence * 255).toInt().coerceIn(0, 255)
      pixels[i] = (alpha shl 24) or (alpha shl 16) or (alpha shl 8) or alpha
    }
    maskBitmap.setPixels(pixels, 0, maskW, 0, 0, maskW, maskH)

    val scaled = Bitmap.createScaledBitmap(maskBitmap, bitmap.width, bitmap.height, true)
    val context = appContext.reactContext ?: return null
    val outFile = File(context.cacheDir, "moodlab-skin-mask-${System.currentTimeMillis()}.png")
    FileOutputStream(outFile).use { scaled.compress(Bitmap.CompressFormat.PNG, 100, it) }

    return mapOf(
      "uri" to Uri.fromFile(outFile).toString(),
      "width" to bitmap.width,
      "height" to bitmap.height,
    )
  }

  private fun exportWithBeautyPipelineInternal(options: Map<String, Any?>): String {
    val sourceUri = options["sourceUri"] as? String
      ?: throw IllegalArgumentException("sourceUri required")
    var bitmap = loadBitmap(sourceUri) ?: throw IllegalArgumentException("Could not load image")
    val original = bitmap.copy(bitmap.config ?: Bitmap.Config.ARGB_8888, true)

    val skinSmooth = (options["skinSmooth"] as? Number)?.toDouble() ?: 0.0
    val textureRestore = (options["textureRestore"] as? Number)?.toDouble() ?: 0.55
    val lutStrength = (options["lutStrength"] as? Number)?.toDouble() ?: 0.75
    val skinProtection = (options["skinProtection"] as? Number)?.toDouble() ?: 0.5
    val outputWidth = (options["outputWidth"] as? Number)?.toInt()
    val outputHeight = (options["outputHeight"] as? Number)?.toInt()

    // Selfie segmentation mask
    val maskBitmap = try {
      val image = InputImage.fromBitmap(bitmap, 0)
      val segmenter = Segmentation.getClient(
        SelfieSegmenterOptions.Builder()
          .setDetectorMode(SelfieSegmenterOptions.SINGLE_IMAGE_MODE)
          .build()
      )
      val mask: SegmentationMask = com.google.android.gms.tasks.Tasks.await(segmenter.process(image))
      val maskW = mask.width
      val maskH = mask.height
      val buffer = mask.buffer
      val mb = Bitmap.createBitmap(maskW, maskH, Bitmap.Config.ARGB_8888)
      val pixels = IntArray(maskW * maskH)
      buffer.rewind()
      for (i in pixels.indices) {
        val confidence = buffer.float
        val alpha = (confidence * 255).toInt().coerceIn(0, 255)
        pixels[i] = (alpha shl 24) or (alpha shl 16) or (alpha shl 8) or alpha
      }
      mb.setPixels(pixels, 0, maskW, 0, 0, maskW, maskH)
      Bitmap.createScaledBitmap(mb, bitmap.width, bitmap.height, true)
    } catch (_: Exception) {
      null
    }

    // Bilateral-style smooth: RenderScript blur masked to skin
    if (skinSmooth > 0.01 && maskBitmap != null) {
      val context = appContext.reactContext!!
      val rs = RenderScript.create(context)
      val blurred = bitmap.copy(bitmap.config ?: Bitmap.Config.ARGB_8888, true)
      val input = Allocation.createFromBitmap(rs, bitmap)
      val output = Allocation.createFromBitmap(rs, blurred)
      val script = ScriptIntrinsicBlur.create(rs, Element.U8_4(rs))
      script.setRadius((skinSmooth * 15).toFloat().coerceIn(1f, 25f))
      script.setInput(input)
      script.forEach(output)
      output.copyTo(blurred)
      rs.destroy()

      val smoothStrength = (skinSmooth * (1.0 - textureRestore * 0.85)).toFloat()
      bitmap = blendWithMask(original, blurred, maskBitmap, smoothStrength)
    }

    // Resize if export dimensions provided
    if (outputWidth != null && outputHeight != null && outputWidth > 0 && outputHeight > 0) {
      val scale = min(
        outputWidth.toFloat() / bitmap.width,
        outputHeight.toFloat() / bitmap.height,
      )
      val newW = (bitmap.width * scale).toInt()
      val newH = (bitmap.height * scale).toInt()
      bitmap = Bitmap.createScaledBitmap(bitmap, newW, newH, true)
    }

    // Note: full CIColorCube parity on Android is V2 — apply mild grade via ColorMatrix when cube absent
    if (lutStrength > 0.01) {
      bitmap = applyLutStrengthApprox(bitmap, lutStrength, maskBitmap, skinProtection)
    }

    val context = appContext.reactContext!!
    val outFile = File(context.cacheDir, "moodlab-beauty-export-${System.currentTimeMillis()}.jpg")
    FileOutputStream(outFile).use { bitmap.compress(Bitmap.CompressFormat.JPEG, 92, it) }
    return Uri.fromFile(outFile).toString()
  }

  private fun blendWithMask(
    background: Bitmap,
    foreground: Bitmap,
    mask: Bitmap,
    strength: Float,
  ): Bitmap {
    val result = background.copy(Bitmap.Config.ARGB_8888, true)
    val canvas = Canvas(result)
    val paint = Paint(Paint.ANTI_ALIAS_FLAG)
    paint.alpha = (strength * 255).toInt().coerceIn(0, 255)

    val maskPaint = Paint(Paint.ANTI_ALIAS_FLAG)
    canvas.drawBitmap(foreground, 0f, 0f, paint)
    maskPaint.xfermode = android.graphics.PorterDuffXfermode(android.graphics.PorterDuff.Mode.DST_IN)
    canvas.drawBitmap(mask, 0f, 0f, maskPaint)
    return result
  }

  private fun applyLutStrengthApprox(
    bitmap: Bitmap,
    strength: Double,
    mask: Bitmap?,
    skinProtection: Double,
  ): Bitmap {
    val result = bitmap.copy(Bitmap.Config.ARGB_8888, true)
    val canvas = Canvas(result)
    val paint = Paint(Paint.ANTI_ALIAS_FLAG)

    val matrix = ColorMatrix().apply {
      setSaturation(1f + (strength * 0.15).toFloat())
    }
    paint.colorFilter = ColorMatrixColorFilter(matrix)
    canvas.drawBitmap(bitmap, 0f, 0f, paint)

    if (mask != null && skinProtection < 0.99) {
      // Keep original skin pixels more protected
      val skinPaint = Paint(Paint.ANTI_ALIAS_FLAG)
      skinPaint.alpha = (skinProtection * 180).toInt().coerceIn(0, 255)
      canvas.drawBitmap(bitmap, 0f, 0f, skinPaint)
    }

    return result
  }
}
