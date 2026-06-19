import ExpoModulesCore
import Vision
import CoreImage
import UIKit
import Accelerate

public class MoodlabRenderCoreModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MoodlabRenderCore")

    Function("isAvailable") { () -> Bool in
      return true
    }

    AsyncFunction("detectFaceGeometry") { (uri: String) -> [String: Any]? in
      return try await Self.detectFaceGeometry(uri: uri)
    }

    AsyncFunction("generateSkinMask") { (uri: String) -> [String: Any]? in
      return try await Self.generateSkinMask(uri: uri)
    }

    AsyncFunction("exportWithBeautyPipeline") { (options: [String: Any]) -> String in
      return try Self.exportWithBeautyPipeline(options: options)
    }

    AsyncFunction("exportWithColorCube") { (sourceUri: String, cubePath: String, strength: Double) -> String in
      return try Self.exportColorCube(sourceUri: sourceUri, cubePath: cubePath, strength: strength)
    }
  }

  // MARK: - Image loading

  private static func loadImage(uri: String) throws -> CIImage {
    let url: URL
    if uri.hasPrefix("file://") {
      guard let parsed = URL(string: uri) else {
        throw NSError(domain: "MoodlabRenderCore", code: 1, userInfo: [NSLocalizedDescriptionKey: "Invalid URI"])
      }
      url = parsed
    } else if uri.hasPrefix("/") {
      url = URL(fileURLWithPath: uri)
    } else {
      guard let parsed = URL(string: uri) else {
        throw NSError(domain: "MoodlabRenderCore", code: 1, userInfo: [NSLocalizedDescriptionKey: "Invalid URI"])
      }
      url = parsed
    }
    guard let image = CIImage(contentsOf: url) else {
      throw NSError(domain: "MoodlabRenderCore", code: 2, userInfo: [NSLocalizedDescriptionKey: "Could not load image"])
    }
    return image
  }

  private static func regionDict(_ x: Double, _ y: Double, _ w: Double, _ h: Double) -> [String: Double] {
    ["x": x, "y": y, "w": w, "h": h]
  }

  private static func clamp01(_ v: Double) -> Double {
    max(0, min(1, v))
  }

  // MARK: - Face geometry (Vision landmarks)

  private static func detectFaceGeometry(uri: String) async throws -> [String: Any]? {
    let ciImage = try loadImage(uri: uri)
    let extent = ciImage.extent
    let w = extent.width
    let h = extent.height
    if w <= 0 || h <= 0 { return nil }

    let handler = VNImageRequestHandler(ciImage: ciImage, options: [:])
    let landmarksRequest = VNDetectFaceLandmarksRequest()
    try handler.perform([landmarksRequest])

    guard let face = landmarksRequest.results?.first as? VNFaceObservation else {
      return nil
    }

    let box = face.boundingBox
    let faceX = box.origin.x
    let faceY = 1.0 - box.origin.y - box.size.height
    let faceW = box.size.width
    let faceH = box.size.height
    let faceRegion = regionDict(faceX, faceY, faceW, faceH)

    var eyesRegion = regionDict(
      faceX + faceW * 0.12,
      faceY + faceH * 0.06,
      faceW * 0.76,
      faceH * 0.28
    )
    var underEyeRegion = regionDict(
      faceX + faceW * 0.1,
      faceY + faceH * 0.3,
      faceW * 0.8,
      faceH * 0.2
    )
    var lipsRegion = regionDict(
      faceX + faceW * 0.26,
      faceY + faceH * 0.62,
      faceW * 0.48,
      faceH * 0.24
    )

    if let landmarks = face.landmarks {
      if let leftEye = landmarks.leftEye, let rightEye = landmarks.rightEye {
        let leftPts = leftEye.normalizedPoints
        let rightPts = rightEye.normalizedPoints
        if !leftPts.isEmpty && !rightPts.isEmpty {
          let leftCenter = Self.averagePoint(leftPts)
          let rightCenter = Self.averagePoint(rightPts)
          let lx = faceX + Double(leftCenter.x) * faceW
          let ly = faceY + (1.0 - Double(leftCenter.y)) * faceH
          let rx = faceX + Double(rightCenter.x) * faceW
          let ry = faceY + (1.0 - Double(rightCenter.y)) * faceH
          let eyeDist = abs(rx - lx)
          let eyeCx = (lx + rx) / 2.0
          let eyeCy = (ly + ry) / 2.0
          eyesRegion = regionDict(
            clamp01(eyeCx - eyeDist * 0.65),
            clamp01(eyeCy - eyeDist * 0.35),
            clamp01(min(1 - (eyeCx - eyeDist * 0.65), eyeDist * 1.3)),
            clamp01(min(1 - (eyeCy - eyeDist * 0.35), eyeDist * 0.55))
          )
          underEyeRegion = regionDict(
            clamp01(eyesRegion["x"]! * 0.95 + faceX * 0.05),
            clamp01(eyeCy + eyeDist * 0.05),
            clamp01(eyesRegion["w"]! * 1.05),
            clamp01(min(1 - (eyeCy + eyeDist * 0.05), eyeDist * 0.35))
          )
        }
      }

      if let outerLips = landmarks.outerLips {
        let pts = outerLips.normalizedPoints
        if pts.count >= 3 {
          var minX = 1.0, minY = 1.0, maxX = 0.0, maxY = 0.0
          for p in pts {
            let px = faceX + Double(p.x) * faceW
            let py = faceY + (1.0 - Double(p.y)) * faceH
            minX = min(minX, px)
            maxX = max(maxX, px)
            minY = min(minY, py)
            maxY = max(maxY, py)
          }
          let padX = (maxX - minX) * 0.15
          let padY = (maxY - minY) * 0.2
          lipsRegion = regionDict(
            clamp01(minX - padX),
            clamp01(minY - padY),
            clamp01(min(1 - (minX - padX), (maxX - minX) + 2 * padX)),
            clamp01(min(1 - (minY - padY), (maxY - minY) + 2 * padY))
          )
        }
      }
    }

    let geometry: [String: Any] = [
      "face": faceRegion,
      "eyes": eyesRegion,
      "underEye": underEyeRegion,
      "lips": lipsRegion,
    ]

    return [
      "geometry": geometry,
      "source": "vision",
      "confidence": Double(face.confidence),
    ]
  }

  private static func averagePoint(_ points: [CGPoint]) -> CGPoint {
    var sx = 0.0, sy = 0.0
    for p in points {
      sx += Double(p.x)
      sy += Double(p.y)
    }
    let n = Double(points.count)
    return CGPoint(x: sx / n, y: sy / n)
  }

  // MARK: - Person segmentation skin mask

  private static func generateSkinMask(uri: String) async throws -> [String: Any]? {
    let ciImage = try loadImage(uri: uri)
    guard #available(iOS 15.0, *) else { return nil }

    let handler = VNImageRequestHandler(ciImage: ciImage, options: [:])
    let request = VNGeneratePersonSegmentationRequest()
    request.qualityLevel = .balanced
    try handler.perform([request])

    guard let observation = request.results?.first as? VNPixelBufferObservation else {
      return nil
    }

    let maskBuffer = observation.pixelBuffer
    let width = CVPixelBufferGetWidth(maskBuffer)
    let height = CVPixelBufferGetHeight(maskBuffer)

    let maskImage = CIImage(cvPixelBuffer: maskBuffer)
    let scaleX = ciImage.extent.width / CGFloat(width)
    let scaleY = ciImage.extent.height / CGFloat(height)
    let scaled = maskImage.transformed(by: CGAffineTransform(scaleX: scaleX, y: scaleY))

    let context = CIContext(options: nil)
    let outURL = FileManager.default.temporaryDirectory
      .appendingPathComponent("moodlab-skin-mask-\(UUID().uuidString).png")
    try context.writePNGRepresentation(
      of: scaled,
      to: outURL,
      format: .RGBA8,
      colorSpace: CGColorSpaceCreateDeviceRGB(),
      options: [:]
    )

    return [
      "uri": outURL.absoluteString,
      "width": Int(ciImage.extent.width),
      "height": Int(ciImage.extent.height),
    ]
  }

  // MARK: - Beauty export pipeline

  private static func exportWithBeautyPipeline(options: [String: Any]) throws -> String {
    guard let sourceUri = options["sourceUri"] as? String else {
      throw NSError(domain: "MoodlabRenderCore", code: 10, userInfo: [NSLocalizedDescriptionKey: "sourceUri required"])
    }

    let lutStrength = (options["lutStrength"] as? Double) ?? 0.75
    let skinSmooth = (options["skinSmooth"] as? Double) ?? 0
    let textureRestore = (options["textureRestore"] as? Double) ?? 0.55
    let evenTone = (options["evenTone"] as? Double) ?? 0
    let reduceShine = (options["reduceShine"] as? Double) ?? 0
    let faceLight = (options["faceLight"] as? Double) ?? 0
    let skinProtection = (options["skinProtection"] as? Double) ?? 0.5
    let outputWidth = options["outputWidth"] as? Int
    let outputHeight = options["outputHeight"] as? Int
    let cubePath = options["cubePath"] as? String

    var ciImage = try loadImage(uri: sourceUri)
    let original = ciImage

    // Person segmentation mask for skin-aware beauty
    var skinMask: CIImage?
    if #available(iOS 15.0, *) {
      let handler = VNImageRequestHandler(ciImage: ciImage, options: [:])
      let request = VNGeneratePersonSegmentationRequest()
      request.qualityLevel = .balanced
      try handler.perform([request])
      if let observation = request.results?.first as? VNPixelBufferObservation {
        let maskImage = CIImage(cvPixelBuffer: observation.pixelBuffer)
        let scaleX = ciImage.extent.width / CGFloat(CVPixelBufferGetWidth(observation.pixelBuffer))
        let scaleY = ciImage.extent.height / CGFloat(CVPixelBufferGetHeight(observation.pixelBuffer))
        skinMask = maskImage.transformed(by: CGAffineTransform(scaleX: scaleX, y: scaleY))
      }
    }

    // Bilateral-style skin smooth: gaussian blur masked to skin, texture restore blend
    if skinSmooth > 0.01, let mask = skinMask {
      let blurRadius = skinSmooth * 14.0
      let blurFilter = CIFilter(name: "CIGaussianBlur")!
      blurFilter.setValue(ciImage, forKey: kCIInputImageKey)
      blurFilter.setValue(blurRadius, forKey: kCIInputRadiusKey)
      guard let blurred = blurFilter.outputImage?.cropped(to: ciImage.extent) else {
        throw NSError(domain: "MoodlabRenderCore", code: 11, userInfo: nil)
      }

      let smoothStrength = skinSmooth * (1.0 - textureRestore * 0.85)
      let blend = CIFilter(name: "CIBlendWithMask")!
      blend.setValue(blurred, forKey: kCIInputImageKey)
      blend.setValue(ciImage, forKey: kCIInputBackgroundImageKey)
      blend.setValue(mask, forKey: kCIInputMaskImageKey)
      if let blended = blend.outputImage {
        ciImage = blended
      }

      // Texture restore: mix original detail back on skin
      if textureRestore > 0.05 {
        let restoreBlend = CIFilter(name: "CIBlendWithMask")!
        restoreBlend.setValue(original, forKey: kCIInputImageKey)
        restoreBlend.setValue(ciImage, forKey: kCIInputBackgroundImageKey)
        restoreBlend.setValue(mask, forKey: kCIInputMaskImageKey)
        if let restored = restoreBlend.outputImage {
          let dissolve = CIFilter(name: "CIDissolveTransition")!
          dissolve.setValue(ciImage, forKey: kCIInputImageKey)
          dissolve.setValue(restored, forKey: kCIInputTargetImageKey)
          dissolve.setValue(textureRestore * smoothStrength, forKey: kCIInputTimeKey)
          ciImage = dissolve.outputImage ?? ciImage
        }
      }
    }

    // Even tone via masked noise reduction
    if evenTone > 0.01, let mask = skinMask {
      let nr = CIFilter(name: "CINoiseReduction")!
      nr.setValue(ciImage, forKey: kCIInputImageKey)
      nr.setValue(evenTone * 0.04, forKey: "inputNoiseLevel")
      nr.setValue(0.4, forKey: "inputSharpness")
      if let toned = nr.outputImage {
        let blend = CIFilter(name: "CIBlendWithMask")!
        blend.setValue(toned, forKey: kCIInputImageKey)
        blend.setValue(ciImage, forKey: kCIInputBackgroundImageKey)
        blend.setValue(mask, forKey: kCIInputMaskImageKey)
        ciImage = blend.outputImage ?? ciImage
      }
    }

    // Reduce shine via highlight compression on skin
    if reduceShine > 0.01, let mask = skinMask {
      let controls = CIFilter(name: "CIHighlightShadowAdjust")!
      controls.setValue(ciImage, forKey: kCIInputImageKey)
      controls.setValue(-reduceShine * 0.35, forKey: "inputHighlightAmount")
      if let adjusted = controls.outputImage {
        let blend = CIFilter(name: "CIBlendWithMask")!
        blend.setValue(adjusted, forKey: kCIInputImageKey)
        blend.setValue(ciImage, forKey: kCIInputBackgroundImageKey)
        blend.setValue(mask, forKey: kCIInputMaskImageKey)
        ciImage = blend.outputImage ?? ciImage
      }
    }

    // Face light on skin mask
    if faceLight > 0.01, let mask = skinMask {
      let exposure = CIFilter(name: "CIExposureAdjust")!
      exposure.setValue(ciImage, forKey: kCIInputImageKey)
      exposure.setValue(faceLight * 0.45, forKey: kCIInputEVKey)
      if let lit = exposure.outputImage {
        let blend = CIFilter(name: "CIBlendWithMask")!
        blend.setValue(lit, forKey: kCIInputImageKey)
        blend.setValue(ciImage, forKey: kCIInputBackgroundImageKey)
        blend.setValue(mask, forKey: kCIInputMaskImageKey)
        ciImage = blend.outputImage ?? ciImage
      }
    }

    // LUT via CIColorCube with skin-safe dissolve
    if let cubePath = cubePath, !cubePath.isEmpty {
      let cubeURL = cubePath.hasPrefix("/") ? URL(fileURLWithPath: cubePath) : URL(string: cubePath)!
      let cubeContent = try String(contentsOf: cubeURL, encoding: .utf8)
      let (data, dimension) = try Self.parseCubeData(cubeContent)

      let filter = CIFilter(name: "CIColorCube")!
      filter.setValue(dimension, forKey: "inputCubeDimension")
      filter.setValue(data, forKey: "inputCubeData")
      filter.setValue(ciImage, forKey: kCIInputImageKey)

      if let graded = filter.outputImage {
        if let mask = skinMask, skinProtection < 0.99 {
          let bgDissolve = CIFilter(name: "CIDissolveTransition")!
          bgDissolve.setValue(ciImage, forKey: kCIInputImageKey)
          bgDissolve.setValue(graded, forKey: kCIInputTargetImageKey)
          bgDissolve.setValue(lutStrength, forKey: kCIInputTimeKey)

          let faceStrength = lutStrength * (1.0 - skinProtection * 0.55)
          let faceDissolve = CIFilter(name: "CIDissolveTransition")!
          faceDissolve.setValue(ciImage, forKey: kCIInputImageKey)
          faceDissolve.setValue(graded, forKey: kCIInputTargetImageKey)
          faceDissolve.setValue(faceStrength, forKey: kCIInputTimeKey)

          if let bgBlended = bgDissolve.outputImage, let faceBlended = faceDissolve.outputImage {
            let skinBlend = CIFilter(name: "CIBlendWithMask")!
            skinBlend.setValue(faceBlended, forKey: kCIInputImageKey)
            skinBlend.setValue(bgBlended, forKey: kCIInputBackgroundImageKey)
            skinBlend.setValue(mask, forKey: kCIInputMaskImageKey)
            ciImage = skinBlend.outputImage ?? graded
          } else {
            ciImage = graded
          }
        } else {
          let dissolve = CIFilter(name: "CIDissolveTransition")!
          dissolve.setValue(ciImage, forKey: kCIInputImageKey)
          dissolve.setValue(graded, forKey: kCIInputTargetImageKey)
          dissolve.setValue(lutStrength, forKey: kCIInputTimeKey)
          ciImage = dissolve.outputImage ?? graded
        }
      }
    }

    // Resize to export preset if requested
    if let ow = outputWidth, let oh = outputHeight, ow > 0, oh > 0 {
      let scaleX = CGFloat(ow) / ciImage.extent.width
      let scaleY = CGFloat(oh) / ciImage.extent.height
      let scale = min(scaleX, scaleY)
      ciImage = ciImage.transformed(by: CGAffineTransform(scaleX: scale, y: scale))
    }

    let context = CIContext(options: nil)
    let outURL = FileManager.default.temporaryDirectory
      .appendingPathComponent("moodlab-beauty-export-\(UUID().uuidString).jpg")
    try context.writeJPEGRepresentation(
      of: ciImage,
      to: outURL,
      colorSpace: CGColorSpaceCreateDeviceRGB(),
      options: [kCGImageDestinationLossyCompressionQuality as CIImageRepresentationOption: 0.92]
    )
    return outURL.absoluteString
  }

  // MARK: - Legacy CIColorCube export

  private static func exportColorCube(sourceUri: String, cubePath: String, strength: Double) throws -> String {
    return try exportWithBeautyPipeline(options: [
      "sourceUri": sourceUri,
      "cubePath": cubePath,
      "lutStrength": strength,
    ])
  }

  private static func parseCubeData(_ content: String) throws -> (Data, Int) {
    var size = 0
    var values: [Float] = []
    for line in content.components(separatedBy: .newlines) {
      let trimmed = line.trimmingCharacters(in: .whitespaces)
      if trimmed.isEmpty || trimmed.hasPrefix("#") { continue }
      if trimmed.hasPrefix("LUT_3D_SIZE") {
        size = Int(trimmed.split(separator: " ").last ?? "0") ?? 0
        continue
      }
      if trimmed.hasPrefix("TITLE") || trimmed.hasPrefix("DOMAIN") { continue }
      let parts = trimmed.split(separator: " ").compactMap { Float($0) }
      if parts.count >= 3 { values.append(contentsOf: [parts[0], parts[1], parts[2]]) }
    }
    guard size > 0 else {
      throw NSError(domain: "MoodlabRenderCore", code: 3, userInfo: [NSLocalizedDescriptionKey: "Invalid cube size"])
    }
    let cubeData = Data(bytes: values, count: values.count * MemoryLayout<Float>.size)
    return (cubeData, size)
  }
}
