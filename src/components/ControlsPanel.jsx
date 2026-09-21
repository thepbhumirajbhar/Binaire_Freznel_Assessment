import React from 'react';
import { View, Flex, Button, Slider, Picker, Item, Heading, Divider } from '@adobe/react-spectrum';

export default function ControlsPanel({
  onFilesSelected,
  onStitch,
  projection,
  setProjection,
  zoom,
  setZoom,
  rotation,
  setRotation,
  onExport,
  exportFormat,
  setExportFormat,
  isProcessing,
  canStitch
}) {
  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  return (
    <View padding="size-250" backgroundColor="gray-100" borderRadius="medium" width="size-3600">
      <Flex direction="column" gap="size-200">
        <Heading level={3}>Panorama Controls</Heading>

        <div>
          <input
            type="file"
            id="file-upload"
            multiple
            accept=".jpg,.jpeg,.png,.avif"
            style={{ display: 'none' }}
            onChange={handleFileInput}
          />
          <Button variant="primary" width="100%" onPress={() => document.getElementById('file-upload').click()}>
            📁 Select Images (JPEG, PNG, AVIF)
          </Button>
        </div>

        <Picker
          label="Projection Type"
          selectedKey={projection}
          onSelectionChange={setProjection}
          width="100%"
        >
          <Item key="cylindrical">Cylindrical Panorama</Item>
          <Item key="spherical">Spherical Panorama</Item>
        </Picker>

        <Button
          variant="cta"
          width="100%"
          onPress={onStitch}
          isDisabled={!canStitch || isProcessing}
        >
          {isProcessing ? '⚙️ Processing...' : '✨ Stitch Panorama'}
        </Button>

        <Divider size="S" />

        <Heading level={4}>Viewport Controls</Heading>
        <Slider label="Zoom Level" minValue={0.5} maxValue={3} step={0.1} value={zoom} onChange={setZoom} />
        <Slider label="Rotation Angle" minValue={-180} maxValue={180} step={1} value={rotation} onChange={setRotation} />

        <Divider size="S" />

        <Heading level={4}>Export Output</Heading>
        <Picker label="Export Format" selectedKey={exportFormat} onSelectionChange={setExportFormat} width="100%">
          <Item key="image/jpeg">JPEG (.jpg)</Item>
          <Item key="image/png">PNG (.png)</Item>
          <Item key="image/avif">AVIF (HDR Supported) (.avif)</Item>
        </Picker>

        <Button variant="accent" width="100%" onPress={onExport}>
          💾 Export Panorama
        </Button>
      </Flex>
    </View>
  );
}