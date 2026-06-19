Pod::Spec.new do |s|
  s.name           = 'MoodlabRenderCore'
  s.version        = '0.1.0'
  s.summary        = 'MoodLab iOS CIColorCube + Vision'
  s.license        = 'MIT'
  s.author         = 'MoodLab'
  s.homepage       = 'https://github.com/adedayoagarau/moodlab'
  s.platforms      = { :ios => '15.0' }
  s.swift_version  = '5.4'
  s.source         = { :git => '' }
  s.static_framework = true
  s.dependency 'ExpoModulesCore'
  s.source_files = '**/*.{h,m,swift}'
end
