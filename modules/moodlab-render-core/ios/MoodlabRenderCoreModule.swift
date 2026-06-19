import ExpoModulesCore

import Vision
import CoreImage
import UIKit

public class MoodlabRenderCoreModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MoodlabRenderCore")

    Function("isAvailable") { () -> Bool in
      return true
    }

    AsyncFunction("detectFaceRegion") { (uri: String) -> [String: Double]? in
      return try await Self.detectRegion(uri: uri, usePersonSegmentation: false)
    }

    AsyncFunction("detectPersonRegion") { (uri: String) -> [String: Double]? in
      return try await Self.detectRegion(uri: uri, usePersonSegmentation: true)
    }

    AsyncFunction("exportWithColorCube") { (sourceUri: String, cubePath: String, strength: Double) -> String in
      return try Self.exportColorCube(sourceUri: sourceUri, cubePath: cubePath, strength: strength)
    }
  }

  private static func loadImage(uri: String) throws -> CIImage {
    let url: URL
    if uri.hasPrefix("file://") {
      url = URL(string: uri)!
    } else if uri.hasPrefix("/") {
      url = URL(fileURLWithPath: uri)
    } else {
      url = URL(string: uri)!
    }
    guard let image = CIImage(contentsOf: url) else {
      throw NSError(domain: "MoodlabRenderCore", code: 1, userInfo: [NSLocalizedDescriptionKey: "Could not load image"])
    }
    return image
  }

  private static func detectRegion(uri: String, usePersonSegmentation: Bool) async throws -> [String: Double]? {
    let ciImage = try loadImage(uri: uri)
    let extent = ciImage.extent
    let w = extent.width
    let h = extent.height
    if w <= 0 || h <= 0 { return nil }

    let handler = VNImageRequestHandler(ciImage: ciImage, options: [:])

  if usePersonSegmentation {
      if #available(iOS 15.0, *) {
        let request = VNGeneratePersonSegmentationRequest()
        request.qualityLevel = .fast
        try handler.perform([request])
        if let observation = request.results?.first as? VNPixelBufferObservation {
          let mask = observation.pixelBuffer
          let width = CVPixelBufferGetWidth(mask)
          let height = CVPixelBufferGetHeight(mask)
          CVPixelBufferLockBaseAddress(mask, .readOnly)
          defer { CVPixelBufferUnlockBaseAddress(mask, .readOnly) }
          guard let base = CVPixelBufferGetBaseAddress(mask) else { return nil }
          let bytesPerRow = CVPixelBufferGetBytesPerRow(mask)
          var minX = width, minY = height, maxX = 0, maxY = 0
          for y in 0..<height {
            let row = base.advanced(by: y * bytesPerRow).assumingMemoryBound(to: UInt8.self)
            for x in 0..<width {
              if row[x] > 64 {
                minX = min(minX, x)
                maxX = max(maxX, x)
                minY = min(minY, y)
                maxY = max(maxY, y)
              }
            }
          }
          if maxX <= minX || maxY <= minY { return nil }
          let padX = Double(maxX - minX) * 0.05
          let padY = Double(maxY - minY) * 0.05
          let nx = max(0, Double(minX) / Double(width) - padX / Double(width))
          let ny = max(0, Double(minY) / Double(height) - padY / Double(height))
          let nw = min(1 - nx, Double(maxX - minX) / Double(width) + 2 * padX / Double(width))
          let nh = min(1 - ny, Double(maxY - minY) / Double(height) + 2 * padY / Double(height))
          return ["x": nx, "y": ny, "width": nw, "height": nh]
        }
      }
    }

    let faceRequest = VNDetectFaceRectanglesRequest()
    try handler.perform([faceRequest])
    guard let face = faceRequest.results?.first as? VNFaceObservation else { return nil }
    let box = face.boundingBox
    // Vision uses bottom-left origin; convert to top-left normalized
    let nx = box.origin.x
    let ny = 1.0 - box.origin.y - box.size.height
    return ["x": nx, "y": ny, "width": box.size.width, "height": box.size.height]
  }

  private static func exportColorCube(sourceUri: String, cubePath: String, strength: Double) throws -> String {
    let ciImage = try loadImage(uri: sourceUri)
    let cubeURL = cubePath.hasPrefix("/") ? URL(fileURLWithPath: cubePath) : URL(string: cubePath)!
    let cubeContent = try String(contentsOf: cubeURL, encoding: .utf8)
    let (data, dimension) = try Self.parseCubeData(cubeContent)

    let filter = CIFilter(name: "CIColorCube")!
    filter.setValue(dimension, forKey: "inputCubeDimension")
    filter.setValue(data, forKey: "inputCubeData")
    filter.setValue(ciImage, forKey: kCIInputImageKey)

    guard let graded = filter.outputImage else {
      throw NSError(domain: "MoodlabRenderCore", code: 2, userInfo: [NSLocalizedDescriptionKey: "CIColorCube failed"])
    }

    let blended: CIImage
    if strength >= 0.999 {
      blended = graded
    } else {
      let dissolve = CIFilter(name: "CIDissolveTransition")!
      dissolve.setValue(ciImage, forKey: kCIInputImageKey)
      dissolve.setValue(graded, forKey: kCIInputTargetImageKey)
      dissolve.setValue(strength, forKey: kCIInputTimeKey)
      blended = dissolve.outputImage ?? graded
    }

    let context = CIContext(options: nil)
    let outURL = FileManager.default.temporaryDirectory.appendingPathComponent("moodlab-export-\(UUID().uuidString).jpg")
    try context.writeJPEGRepresentation(of: blended, to: outURL, colorSpace: CGColorSpaceCreateDeviceRGB(), options: [:])
    return outURL.absoluteString
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
